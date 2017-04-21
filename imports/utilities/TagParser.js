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
				console.log("HERE",x)
				x = x.split(":");
				x[0] = x[0].substring(1)
				x = {tagname:x[1],tag_id:this.tagcount,class:x[0]}
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
			returnarr.push(x)
		})
		return returnarr.filter((tag)=>{
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