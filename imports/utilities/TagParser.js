/*
 Tag Parser Details

 Working:
 - Able to parse basic tags (ie:green eyes,blue hair) into a JSON file
 - Able to take a $ declaration before a word to denote that as a certain parent class
 (ie: $male:tomgirl has male as the parent class and tomgirl as the actual tag.)

 Sorta Working:
 - Parent/Child Relations, denoted by an @ symbol before a parent class 
 (ie: @$character:Hideyoshi Kinoshita->($gender:Hideyoshi,$male:green eyes))
 - Size/count tag splitting. I'm working to incorporate it to where most class based tags can have stuff
 like count, color, and size parsed from the string to allow for better searching (ie: $female:purple hair
 takes the purple and places it into it's own category.) I need to add said function to general tags though
 and test it more. (May be time to try out those testing suites.)
 -Child ID's. When the splitTags function is executed recursively on an @ string, it actually does return
 the correct local ID's of the children tags. The issue comes from the screwy math involved when it comes to
 initially splitting and parsing the base string.

 Not Working:
 -Parent ID's. I screwed up the maths involved to where all the children of said parent have the correct ID's
  pushed to the array, but due to the screwy nature of the tagging system, there's a gap when the regex splits
  the initial tag string.

 Need to Add:
 -Recurssive tagging in one string. I haven't tested out something like @$series:Neon Genesis Evangelion->
 (@$character:Asuka Langley Soryu->($gender:female,$female:red hair)) so until I do, you have to break up multiple
 relationships via commas. This is more of a dream feature since I haven't tested whether or not my current regex
 will except such a string and it's already 40+ characters long.
 -Error checking! As of now, there is no error, try/except, or anything to catch malformed strings, what ends up
 happening is that anything that is not a JSON object at the time of the return statement is filtered from the
 return array, but otherwise, malformed strings fail silently.

*/
export default class TagParser{
	constructor(string,tagObj,tagCount){
		//Note, that is absurdly complex and I KNOW people don't care.
		this.basetag = string.split(/,(?=[\w$@,:/.!?*\\;+\-\> ]*(?=(\([\w$@,\-\>!?*\\.;+/: ]*\)|\$?(?!(.*\))|$))))/).filter((x,i)=>{return x != undefined;})
		console.log(this.basetag)
		this.baseobj = tagObj
		this.tagcount = tagCount
		this.sortedTags = this.splitTags(this.basetag,false)
	}
	splitTags(tags,parent){
		var returnarr = []
		tags.forEach((x,i)=>{
			console.log(parent,this.tagcount,x)
			this.tagcount++;
			x = x.trim();
			console.log(x,x.match(/^\$[a-zA-Z0-9]{1,}:/),parent,this.tagcount)
			//Testing for group tags like Character, Language, Male/Female, etc.
			if(x.match(/^\$[a-zA-Z0-9]{1,}:/)){
				x = x.split(":");
				x[0] = x[0].substring(1)
				let parentTag = x[0]
				x = this.tagCountSizeCheck(x[1],parentTag)
				x.tag_id = this.tagcount
				x.class = parentTag
				console.log(x);
			}
			//Testing for parent-child groups like @character:Emperor Penguin->($female:hair over one eye,$female:blush,$female:headphones)
			else if(x.match(/^\@\$[a-zA-Z0-9]{1,}:/)){
				console.log(x)
				var coolmatch = x.match(/^\@\$?[a-zA-Z0-9]{1,}:/)[0]
				x = x.split('->')
				x[0] = x[0].substring(x[0].indexOf('$')+1).split(':')
				x[1] = x[1].replace(/\(|\)/g,'').split(',')
				//Recursive call function into an array, insane high level stuffs all in the name of a
				//better tagging system!
				console.log(x)
				var falseParent = this.tagcount;
				returnarr.push({tagname:x[0][1],tag_id:this.tagcount,class:x[0][0],children:this.splitTags(x[1],falseParent)})
				return x;
			}
			else{
				var genObj = {tagname:x,tag_id:this.tagcount}
				if (x.match(/^[0-9]+ /)){
					x = x.split(' ',2)
					x = {tagname:x[1],count:parseInt(x[0]),tag_id:this.tagcount,class:"general"}
				}
			}
			if(parent){
				if(x.hasOwnProperty("parent_id")){
					x.parent_id.push(parent)
				} else {
					x["parent_id"] = [parent]
				}
			}
			returnarr.push(x)
		})
		console.log(returnarr);
		return returnarr.filter((tag)=>{
			console.log(tag);
			return typeof(tag) == 'object';
		})
	}
	getTagCount(){
		return this.tagcount
	}
	tagSimplifier(tag,classArr){
		var alreadyHere = false
		if (!classArr.hasOwnProperty(tag.class)){
			classArr[tag.class] = []
		}
		for(var classTag in classArr[tag.class]){
			if(classArr[tag.class][classTag].tagname == tag.tagname){
				alreadyHere = true
				if(!tag.hasOwnProperty('children')){
					break;
				}
				if(!classArr[tag.class][classTag].hasOwnProperty('children')){
					classArr[tag.class][classTag]['children'] = tag.children
				}
				else{
					classArr[tag.class][classTag]['children'].join(tag.children)
				}
				break;
			}
		}
		if(!alreadyHere){
			classArr[tag.class].push(tag)
		}
		if(!classArr[tag.class].hasOwnProperty('id_array')){
			classArr[tag.class]['id_array'] = []
		}
		classArr[tag.class]['id_array'].push(tag.tag_id)
		return classArr
	}
	tagCountSizeCheck(tag,parent){
		console.log(tag,parent);
		//Incrediably lazy check for certain parent classes to just send back the tag. This is for 2 Large Breasts, not Too Many Cooks.
		let lazychecker = {
			"series":'',
			"franchise":'',
			//I know, Tumblr and reverse-trolling 4chan /pol/tards will shit over me. Deal with it! Unless you're going to pay me to include it.
			"gender":'',
			"language":'',
			//There may be instances where clones and shit are applicable. But Two 2B's or Nine 9S is just a nightmare to parse unless I have a database
			//Of all these peeples.
			"character":''
		}
		let basename = tag
		let baseobj = {}
		if (lazychecker.hasOwnProperty(parent)){
			console.log(tag);
			return {tagname:tag}
		};
		if (tag.match(/^[0-9]{1,} /)){
			tag = tag.split(' ',2)
			baseobj.count = parseInt(tag[0])
			tag = tag[1]
		}
		if (tag.match(/^(large|medium|small|huge|tiny|gigantic) /i)){
			tag = tag.split(' ',2)
			baseobj.objectSize = tag[0]
			tag = tag[1]
		}
		baseobj.tagname = tag
		return baseobj
	}
	flattenTags(){
		var flattenedObj = this.baseobj
		this.sortedTags.forEach((tag,i)=>{
			if (tag.hasOwnProperty("children")){
				for(var i = 0; i < tag.children.length;i++){
					flattenedObj = this.tagSimplifier(tag.children[i],flattenedObj)
					tag.children[i] = tag.children[i].tag_id
					console.log(flattenedObj)
				}
			}
			flattenedObj = this.tagSimplifier(tag,flattenedObj)

		})
		return flattenedObj
	}
}