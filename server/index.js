import { aiHandler } from './ai.js';


import { atlasLookup } from './dns.js';


import express from 'express';


import mongoose from 'mongoose';


import dotenv from 'dotenv';


import path from 'node:path';


import { fileURLToPath } from 'node:url';


import { districts, guidance } from './shared.js';


const root = path.dirname(fileURLToPath(import.meta.url));


dotenv.config({ path: path.join(root, '.env'), quiet: true });


const app = express();


app.use(express.json({ limit: '20kb' }));

<<<<<<< HEAD
let dbPromise = null;
export async function connectDB() {
 if (mongoose.connection.readyState === 1) return;
 if (!dbPromise) {
  if (!process.env.MONGODB_URI) {
   throw new Error('MONGODB_URI environment variable is missing.');
  }
  dbPromise = mongoose.connect(process.env.MONGODB_URI, {
   serverSelectionTimeoutMS: 10000,
   lookup: atlasLookup
  }).catch(err => {
   dbPromise = null;
   throw err;
  });
 }
 await dbPromise;
}

app.use('/api', async (req, res, next) => {
 try {
  await connectDB();
  next();
 } catch (e) {
  console.error('Database connection failed:', e.message);
  res.status(500).json({ message: 'Unable to connect to database. Please check configuration.' });
 }
});

=======

app.post('/api/ai/suggest',aiHandler);


let connectionPromise;


export async function connectDatabase(){


 if(mongoose.connection.readyState===1)return;


 if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI is required.');


 if(!connectionPromise)connectionPromise=mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000,lookup:atlasLookup}).catch(error=>{connectionPromise=undefined;throw error;});


 await connectionPromise;


}


app.use('/api',async(req,res,next)=>{


 try{await connectDatabase();next();}catch(error){res.status(503).json({message:'Database unavailable. Please try again shortly.'});}


});


>>>>>>> 2449114d5b15c151ae521b3af80f50f4a7f3f0c3
const schema = new mongoose.Schema({


 title: {type:String,required:true,trim:true,minlength:5,maxlength:100},


 type: {type:String,required:true,enum:Object.keys(guidance)},


 district: {type:String,required:true,enum:districts},


 location: {type:String,required:true,trim:true,minlength:3,maxlength:100},


 description: {type:String,required:true,trim:true,minlength:15,maxlength:1000},


 observedAt: {type:Date,required:true,validate:{validator:value=>value.getTime()<=Date.now()+60000,message:'Observation time cannot be in the future.'}},


 isDemo: {type:Boolean,default:false}


}, {timestamps:true});


const Report = mongoose.model('DisasterReport',schema);


app.get('/api/health',(req,res)=>res.json({status:'ok',database:mongoose.connection.readyState===1?'connected':'disconnected'}));


app.get('/api/reports',async(req,res,next)=>{try{res.json(await Report.find().sort({createdAt:-1}).limit(500));}catch(e){next(e);}});


app.post('/api/reports',async(req,res,next)=>{


 try{const {title,type,district,location,description,observedAt}=req.body;res.status(201).json(await Report.create({title,type,district,location,description,observedAt}));}catch(e){next(e);}


});


app.patch('/api/reports/:id',async(req,res,next)=>{


 try{


  if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid report ID.'});


  const allowed=['title','type','district','location','description','observedAt'];


  const updates=Object.fromEntries(allowed.filter(key=>Object.hasOwn(req.body,key)).map(key=>[key,req.body[key]]));


  if(!Object.keys(updates).length)return res.status(400).json({message:'No report changes supplied.'});


  const report=await Report.findByIdAndUpdate(req.params.id,{$set:updates},{runValidators:true,returnDocument:'after'});


  if(!report)return res.status(404).json({message:'This report has already been removed or does not exist.'});


  res.json(report);


 }catch(e){next(e);}


});


app.delete('/api/reports/:id',async(req,res,next)=>{


 try{


  if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid report ID.'});


  const report=await Report.findByIdAndDelete(req.params.id);


  if(!report)return res.status(404).json({message:'This report has already been removed or does not exist.'});


  res.json({message:'Report deleted.',id:report._id});


 }catch(e){next(e);}


});


app.use('/api',(req,res)=>res.status(404).json({message:'API route not found.'}));


app.use(express.static(path.join(root,'../dist')));


app.use((error,req,res,next)=>{


 if(error.name==='ValidationError') return res.status(400).json({message:'Check your report details.',errors:Object.fromEntries(Object.keys(error.errors).map(key=>[key,key==='observedAt'?'Enter a valid observation time that is not in the future.':`Enter a valid ${key}.`]))});


 if(error.type==='entity.parse.failed')return res.status(400).json({message:'Invalid request data.'});


 if(error.type==='entity.too.large')return res.status(413).json({message:'Report is too large.'});


 res.status(500).json({message:'Unable to complete your request. Please try again.'});


});

<<<<<<< HEAD
if (!process.env.VERCEL) {
 try {
  await connectDB();
  if(process.argv.includes('--seed')){
   if(await Report.countDocuments()===0)await Report.insertMany([
    {title:'Demo: water covering a local road',type:'Flood',district:'Ratnapura',location:'Example neighbourhood',description:'Fictional example showing a community report of water covering a road. This is not an actual incident.',observedAt:new Date(),isDemo:true},
    {title:'Demo: reported slope movement',type:'Landslide',district:'Badulla',location:'Example hillside',description:'Fictional example showing a report of slope movement near a hillside. This is not an actual incident.',observedAt:new Date(),isDemo:true},
    {title:'Demo: coastal hazard concern',type:'Tsunami',district:'Galle',location:'Example coastal area',description:'Fictional example for demonstrating coastal safety guidance. This is not a tsunami warning.',observedAt:new Date(),isDemo:true}
   ]);
   console.log('Fictional demonstration reports ready.');await mongoose.disconnect();
  }else app.listen(process.env.PORT||5000,()=>console.log('Safe Lanka running on port '+(process.env.PORT||5000)+'; MongoDB connected.'));
 }catch(e){console.error('Database connection failed:',e.name);process.exit(1);}
}

export default app;
=======

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){


try{


 await connectDatabase();


 if(process.argv.includes('--seed')){


  if(await Report.countDocuments()===0)await Report.insertMany([


   {title:'Demo: water covering a local road',type:'Flood',district:'Ratnapura',location:'Example neighbourhood',description:'Fictional example showing a community report of water covering a road. This is not an actual incident.',observedAt:new Date(),isDemo:true},


   {title:'Demo: reported slope movement',type:'Landslide',district:'Badulla',location:'Example hillside',description:'Fictional example showing a report of slope movement near a hillside. This is not an actual incident.',observedAt:new Date(),isDemo:true},


   {title:'Demo: coastal hazard concern',type:'Tsunami',district:'Galle',location:'Example coastal area',description:'Fictional example for demonstrating coastal safety guidance. This is not a tsunami warning.',observedAt:new Date(),isDemo:true}


  ]);


  console.log('Fictional demonstration reports ready.');await mongoose.disconnect();


 }else app.listen(process.env.PORT||5000,()=>console.log('Safe Lanka running on port '+(process.env.PORT||5000)+'; MongoDB connected.'));


}catch(e){console.error('Database connection failed:',e.name);process.exit(1);}
>>>>>>> 2449114d5b15c151ae521b3af80f50f4a7f3f0c3











}


export default app;


