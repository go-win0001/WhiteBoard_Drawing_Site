const mongoose = require('mongoose');

const { Schema } = mongoose;

const canvasSchema = new Schema(
  { //primart key is _id i.e canvasId
    owner: {   //here we place the _id of user whoes email is used to create canvas
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {  
      type: String,
      required: true,
      trim: true,
    },
    elements: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    shareWith: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

canvasSchema.statics.getUserCanvas=async function(userId){
   try {
      //const user= await mongoose.model('User').findOne({ email });
      // if(!user){
      //   throw new Error('User not found');
      // }
      //Fetch all canvas that is shared or owned by email(of user) 
      const allcanvas=await this.find({
        $or:[
          {owner: userId},
          {shareWith: userId}
        ]
      },{    // second srgument is projection means exclude this teo field  
        elements: 0,
        shareWith: 0,
      }).populate('owner', 'username email'); // populate owner with username and email
      return allcanvas;
   } catch (error) {
        throw new Error('Error fetching canvases: ' + error.message);
   }
}

canvasSchema.statics.loadCanvas=async function(userId,canvasId){   // load a canvas with id CanvasId aslo make sure the correct user is reqesting for canvas
   try {
      const canvas= await this.findById(canvasId);
      if (!canvas) 
        throw new Error('Canvas not found');

      if(canvas.owner.toString() !== userId.toString() && !canvas.shareWith.includes(userId)){
        throw new Error('You do not have permission to access this canvas');
      }
      return canvas;
   } catch (error) {
        throw new Error('Error fetching canvases: ' + error.message);
   }
}
canvasSchema.statics.createCanvas=async function(userId,name){
   try {
      //Fetch all canvas that is shared or owned by email(of user) 
      const canvas= await this.create({
        owner: userId,
        name: name, 
        elements: [],
        shareWith: []
      })
      return  { message: "Canvas created successfully", canvasId: canvas._id ,name: canvas.name };
   } catch (error) {
        throw new Error('Error while Creating canvas: ' + error.message);
   }
}


canvasSchema.statics.updateCanvas = async function (canvasId, userId, elements) {
  try {
    const canvas = await this.findById(canvasId);
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    const isOwner = canvas.owner.toString() === userId.toString();
   const isShared = !canvas.shareWith ? true : canvas.shareWith.includes(userId);

    if (!isOwner && !isShared) {
      throw new Error('Unauthorized to update this canvas '+isOwner+" "+isShared+" "+userId+" "+canvas.owner );
    }

     canvas.elements = elements;
      await canvas.save();
       return { message: "Canvas updated successfully" };

  } catch (error) {
    throw new Error('Error updating canvas: ' + error.message);
  }
};

//make static method to delete canvas take canvasId ,emailas argument
canvasSchema.statics.deleteCanvas = async function(canvasId, userId) {
  try {
      
      const canvas = await this.findOne({ _id: canvasId, owner: userId });
      if (!canvas) {
        throw new Error('you do not have permission to delete this canvas');
      }

      await this.deleteOne({ _id: canvasId }); 
      return { message: 'Canvas deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting canvas: ' + error.message);
    
  }
}

canvasSchema.statics.shareCanvas = async function (canvasId, email, shareWithEmail) {
  try {
    const userToShare = await mongoose.model('User').findOne({ email: shareWithEmail });
    if (!userToShare) {
      throw new Error('User with this email not found');
    }

    const ownerUser = await mongoose.model('User').findOne({ email });
    if (!ownerUser) {
      throw new Error('User not found');
    }

    const canvas = await this.findById(canvasId);
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    if (canvas.owner.toString() !== ownerUser._id.toString()) {
      throw new Error('Only the owner can share this canvas'+""+canvasId+""+email+""+shareWithEmail);
    }

    if (canvas.owner.toString() === userToShare._id.toString()) {
      throw new Error('Owner cannot be added to shared list');
    }

    if (canvas.shareWith.some(id => id.toString() === userToShare._id.toString())) {
      throw new Error('Already shared with this user');
    }

    canvas.shareWith.push(userToShare._id);
    return await canvas.save(); // Return updated canvas
  } catch (error) {
    throw new Error('Error sharing canvas: ' + error.message);
  }
};



module.exports = mongoose.model('Canvas', canvasSchema);
