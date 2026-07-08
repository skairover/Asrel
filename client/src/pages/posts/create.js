import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/RichTextEditor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/posts",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post created!");
      setTitle("");
      setContent("");
      router.push('/posts');
    } catch (err) {
      toast.error("Failed to create post");
      console.log(err.response?.data?.error );
    }
  };

  return (
    <div className="bg-[#F5EFE6] h-screen w-screen overflow-x-hidden">
      <form onSubmit={handleSubmit} className="space-y-4 mx-auto p-6 ">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Create Post</h2>
          <button type="submit" className="bg-[#7895B2] hover:bg-[#AEBDCA] text-white px-4 py-2 rounded cursor-pointer">
            Post
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded bg-[#FFFFFF] border border-[#AEBDCA] outline-none"
          required
        />
          <div>
          <RichTextEditor
            value={content}
            onChange={setContent}
          />
        </div>

      </form>
    </div>
  );
}
