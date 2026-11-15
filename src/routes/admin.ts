import { Router } from 'express'; import { AppDataSource } from '../database/data-source'; import { requireAdmin } from '../middleware/auth';
import { Section } from '../entities/Section'; import { Project } from '../entities/Project'; import { Testimonial } from '../entities/Testimonial';
import { Curriculum } from '../entities/Curriculum'; import { Enquiry } from '../entities/Enquiry'; import { SiteSetting } from '../entities/SiteSetting';
import { v2 as cloudinary } from 'cloudinary';
export const adminRoutes=Router(); adminRoutes.use(requireAdmin);
function crud<T extends {id:string}>(path:string, entity:new()=>T, fields:string[]) {
 const repo=AppDataSource.getRepository(entity);
 adminRoutes.get('/'+path,async(_q,res,next)=>{try{res.json(await repo.find({order:{createdAt:'DESC'} as any}));}catch(e){next(e);}});
 adminRoutes.post('/'+path,async(q,res,next)=>{try{const data=Object.fromEntries(Object.entries(q.body||{}).filter(([k])=>fields.includes(k)));res.status(201).json(await repo.save(repo.create(data as any)));}catch(e){next(e);}});
 adminRoutes.put('/'+path+'/:id',async(q,res,next)=>{try{const row=await repo.findOneBy({id:q.params.id} as any);if(!row)return res.status(404).json({message:'Record not found'});Object.assign(row,Object.fromEntries(Object.entries(q.body||{}).filter(([k])=>fields.includes(k))));res.json(await repo.save(row));}catch(e){next(e);}});
 adminRoutes.delete('/'+path+'/:id',async(q,res,next)=>{try{const r=await repo.delete(q.params.id);if(!r.affected)return res.status(404).json({message:'Record not found'});res.status(204).send();}catch(e){next(e);}});
}
crud('sections',Section,['slug','title','sectionType','content','sortOrder','isVisible','status']);
crud('projects',Project,['title','description','category','imageUrl','gradeLabel','gallery','sortOrder','isPublished']);
crud('testimonials',Testimonial,['name','designation','quote','avatarUrl','rating','status','sortOrder']);
crud('curriculum',Curriculum,['title','gradeLabel','fileUrl','fileName','description','sortOrder','isPublished']);
adminRoutes.get('/site-settings',async(_q,res,next)=>{try{const rows=await AppDataSource.getRepository(SiteSetting).find();res.json(Object.fromEntries(rows.map(r=>[r.key,r.value])));}catch(e){next(e);}});
adminRoutes.put('/site-settings',async(q,res,next)=>{try{const repo=AppDataSource.getRepository(SiteSetting);for(const [key,value] of Object.entries(q.body||{})){let row=await repo.findOneBy({key});if(!row)row=repo.create({key,value:value as any});else row.value=value as any;await repo.save(row);}res.json({message:'Settings updated'});}catch(e){next(e);}});
adminRoutes.get('/enquiries',async(_q,res,next)=>{try{res.json(await AppDataSource.getRepository(Enquiry).find({order:{createdAt:'DESC'}}));}catch(e){next(e);}});
adminRoutes.patch('/enquiries/:id',async(q,res,next)=>{try{const repo=AppDataSource.getRepository(Enquiry);const row=await repo.findOneBy({id:q.params.id});if(!row)return res.status(404).json({message:'Not found'});if(!['new','in_progress','closed'].includes(q.body?.status))return res.status(400).json({message:'Invalid status'});row.status=q.body.status;res.json(await repo.save(row));}catch(e){next(e);}});
adminRoutes.get('/media/signature',(_q,res)=>{if(!process.env.CLOUDINARY_API_SECRET||!process.env.CLOUDINARY_API_KEY||!process.env.CLOUDINARY_CLOUD_NAME)return res.status(503).json({message:'Cloudinary not configured'});
 cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
 const timestamp=Math.round(Date.now()/1000);const folder='opot-website';const signature=cloudinary.utils.api_sign_request({timestamp,folder},process.env.CLOUDINARY_API_SECRET);
 res.json({timestamp,signature,folder,cloudName:process.env.CLOUDINARY_CLOUD_NAME,apiKey:process.env.CLOUDINARY_API_KEY});});

// One-time import of the website's default content (sent by the admin UI). Existing rows are never overwritten.
adminRoutes.post('/bootstrap',async(q,res,next)=>{try{
 const {sections=[],projects=[],testimonials=[],curriculum=[],settings={}}=q.body||{};
 await AppDataSource.transaction(async m=>{
  const sRepo=m.getRepository(Section);
  for(const [i,s] of (sections as any[]).entries()){ if(!s?.slug||await sRepo.findOneBy({slug:s.slug}))continue;
   await sRepo.save(sRepo.create({slug:s.slug,title:s.title||s.slug,sectionType:s.slug,content:s.content||{},sortOrder:i,isVisible:true,status:'published'})); }
  for(const [entity,rows] of [[Project,projects],[Testimonial,testimonials],[Curriculum,curriculum]] as const){
   const repo=m.getRepository(entity as any); if(await repo.count())continue; for(const r of rows as any[])await repo.save(repo.create(r)); }
  const setRepo=m.getRepository(SiteSetting);
  for(const [key,value] of Object.entries({...settings,meta:{initialized:true}})){ if(await setRepo.findOneBy({key}))continue; await setRepo.save(setRepo.create({key,value:value as any})); }
 });
 res.json({message:'Default content imported'});
}catch(e){next(e);}});
