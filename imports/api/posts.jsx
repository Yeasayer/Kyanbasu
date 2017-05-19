import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { FilesCollection } from 'meteor/ostrio:files';

var Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  storagePath:"/vagrant/sites/kyanbooru/public/images/uploads",
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg|webm/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
}
var Tags = new Mongo.Collection('tagsdb',{
    idGeneration:'MONGO',
})
var ImageTags = new Mongo.Collection('imagetagsdb',{
  'idGeneration':'MONGO',
})
Meteor.methods({
  'tags.insert'(tag){
    check(tag.tagname,String);

    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    let baseTagObj = {
      tagname:tag.tagname,
      createdAt:new Date(),
      count:1,
    }
    if (tag.count){
      baseTagObj.objectCounts = [tag.count] 
    }
    if (tag.objectSize){
      baseTagObj.objectSizes = [tag.objectSize]
    }
    if (tag.parent){
      baseTagObj.parents = [tag.parent]
    }
    Tags.insert(baseTagObj)
  },
  'tags.update'(tag,bool){
    check(tag.tagname,String);
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    if (bool){
      Tags.update({tagname:tag.tagname},
        {
          $inc:{count:1},
          $addToSet:{
            parents:tag.class,
            objectSizes:tag.objectSize,
            objectCounts:tag.objectCounts,
          },
      },{
        upsert:true,
      })
    } else {
      Tags.update({tagname:tag.tagname},
        {
          $inc:{count:-1},
          $addToSet:{
            parents:tag.class,
            objectSizes:tag.objectSize,
            objectCounts:tag.objectCounts,
          },
      },{
        upsert:false,
      })
    }
  },
  'tags.find'(tag,parent,count,size){
    check(tag,String);
    check(parent,String);
    check(count,Number);
    check(size,String);
    let baseTagRetrieve = Tags.find({tagname:tag}).fetch()
    if(parent){

    }
  },
  'imgtags.insert'(tags,imgid,ext){
    check(tags,Object);
    check(imgid,String);

    if (!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    let ultraFlatTagArr = []
    //Flattening the tags even more because I fucked up big time.
    //Thankfully, I had enough foresight to include the parent class in
    //the tags themselves, makes this slightly less painful.
    for (var parentTag in tags.tags.descriptors){
      let shortParents = tags.tags.descriptors[parentTag]
      ultraFlatTagArr = ultraFlatTagArr.concat(shortParents)
    }
    // Note to self, if someone had fucking told me that overtly nested
    // Database objects were a bad idea, I would have went with MySQL or
    // Postgres.
    let ImgTagsObj = {
        img_id: imgid,
        img_uploader:tags.uploader_id,
        img_upload_date:tags.uploadedOn,
        img_artist:tags.tags.artist,
        img_age_raiting:tags.tags.ageRating,
        img_parent_gallery:tags.tags.parentGallery,
        img_source:tags.tags.source,
        img_tagcount:tags.tags.tagcount,
        //Adding Image Score Preemtively.
        img_score:0,
        img_title:tags.tags.title,
        tags:ultraFlatTagArr,
        full_filename:imgid+ext
    }
    ImageTags.insert(ImgTagsObj)
  }
})
export {Images}