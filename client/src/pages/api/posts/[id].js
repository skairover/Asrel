import {connectDB} from '@/lib/db';
import Post from '@/models/Post';
import {verifyToken } from '@/utils/auth';


export default async function handler(req, res){
    await connectDB();
    const {method, query: {id}} = req.body;

    switch(method){
        case "GET":
            try{
                const post = await Post.findById(id).populate('author', 'name email');
                if(!post) return res.status(404).json({error: "post not found"});
                return res.status(201).json(post);
            }catch(err){
                return res.status(500).json({error: "failed to fetch post"});
            }
            
        case "PUT":
            try{
                const user = verifyToken(req);
                if(!user) return res.status(401).json({error:"unauthorized"});
                
                const post = await Post.findById(id);
                if(!post) return res.status(404).json({error:"post not found"});

                if(post.author.toString() !== user.id) return res.status(403).json({error: "not allowed"});

                post.title = req.body.title || post.title;
                post.content = req.body.content || post.content;
                const updated = await post.save();
                return res.status(201).json(updated);

            }catch(err){
                return res.status(500).json({error: "updating failed"});

            }
            
        case "DELETE":
            try{
                const user = verifyToken(req);
                if(!user) return res.status(401).json({error:"unauthorized"});
                
                const post = await Post.findById(id);
                if(!post) return res.status(404).json({error:"post not found"});

                if(post.author.toString() !== user.id) return res.status(403).json({error: "not allowed"});

                await post.deleteOne();
                return res.status(200).json({message: "post deleted"});
            }catch(err){
                return res.status(500).json({error: "deleting failed"});
            }
            

        default:
            res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
        }       
}