export default class TagParser{
	constructor(string,tagObj){
		this.basetag = string.split(/,(?=[\w$@,:\-> ]*\((?!\w*\)(,|@| )))/)
		this.baseobj = tagObj
		this.tagcount = 0
		console.log(this.basetag,this.baseobj)
		var sorted = this.splitTags(this.basetag,false)
		console.log(sorted)
	}
	splitTags(tags,parent){
		var returnarr = []
		tags.forEach((x,i)=>{
			this.tagcount++;
			x = x.trim();
			console.log(x,x.match(/^\$[a-zA-Z0-9]{1,}:/))
			//Testing for group tags like Character, Language, Male/Female, etc.
			if(x.match(/^\$[a-zA-Z0-9]{1,}:/)){
				x = x.split(":");
				x[0] = x[0].substring(1)
				x = {tagname:x[1],_id:this.tagcount,class:x[0]}
				if (parent){
					x['parent']=parent
				}
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
				returnarr.push({tagname:x[0][1],_id:this.tagcount,class:x[0][0],children:this.splitTags(x[1],this.tagcount)})
				return x;
			}
			else{
				var genObj = {tagname:x,_id:this.tagcount}
				if (x.match(/^[0-9]+ /)){
					x = x.split(' ',2)
					console.log(x,tagObj)
					x = {tagname:x[1],count:parseInt(x[0]),_id:this.tagcount,class:"general"}
				}
			}
			returnarr.push(x)
		})
		return returnarr
	}
}