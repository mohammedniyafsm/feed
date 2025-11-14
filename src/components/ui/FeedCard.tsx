"use client";

import { useState } from "react";
import { inter } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CommentSkeleton from "@/components/ui/CommentSkeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import getRandomAvatar from "./anonymousCard";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


interface FeedCardProps {
  id: string;
  topic: string;
  category: string;
  user: { username: string };
  date: string;
  _count: { sectionLikes: number; feedback: number };
  sectionLikes?: { id: string }[];          
}

/* ---------------------------------------------------- */
export function FeedCard(props: FeedCardProps) {
  const {
    id,
    topic,
    category,
    user,
    date,
    _count,
    sectionLikes = [],                    
  } = props;


  const [liked, setLiked] = useState(sectionLikes.length > 0);
  const [likeCount, setLikeCount] = useState(_count.sectionLikes ?? 0);
  const [loadingLike, setLoadingLike] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const { data } = await axios.get(`/api/feedback?sectionId=${id}`);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setCommentsLoading(false);
    }
  };

  const toggleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));

    try {
      if (!wasLiked) {
        // LIKE
        const { data } = await axios.post("/api/section/user/like", { sectionId: id });
        if (!data.liked) {
          setLiked(true);
          setLikeCount((c) => c + 1);
        }
      } else {
        // UNLIKE
        const { data } = await axios.delete(`/api/section/user/like`,{ data : {sectionId: id} });
        if (!data.unliked) {
          setLiked(false);
          setLikeCount((c) => c - 1);
        }
      }
    } catch (e) {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setLoadingLike(false);
    }
  };

  const addComment = async (sectionId : String  , comment : String, anonymous : Boolean)=>{
    const response = await axios.post(`/api/feedback`,{ sectionId, comment, anonymous});
    console.log(response.data)
  }


  return (
    <div className="bg-card/20 border border-border rounded-2xl p-5 flex flex-col gap-3">

      {/* ---- Category + Like button ---- */}
      <div className="flex justify-between items-center">
        <span className="text-xs px-2.5 py-1 rounded-md bg-accent/20">
          {category}
        </span>

        <button
          onClick={toggleLike}
          disabled={loadingLike}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/30 hover:bg-muted/50 disabled:opacity-50 transition"
        >
          <Heart
            className={`w-4 h-4 ${liked ? "fill-white text-white" : ""}`}
          />
          <span>{likeCount}</span>
        </button>
      </div>

      {/* ---- Topic ---- */}
      <div className="pl-2">
        <h3 className={`${inter} text-base font-semibold`}>
          {topic}
        </h3>
      </div>

      {/* ---- Author + Date ---- */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pl-2">
        <span>by {user.username}</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>

      {/* ---- Action Buttons ---- */}
      <div className="flex gap-3 pt-2">

        {/* ---- Give Feedback ---- */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              Give Feedback
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Feedback</DialogTitle>
              <DialogDescription>
                About: <b>{topic}</b><br />
                by {user.username}
              </DialogDescription>
            </DialogHeader>

            <Textarea
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex items-center gap-2 mt-3">
              <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              <Label>{isAnonymous ? "Anonymous" : "Show my name"}</Label>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={()=>addComment(feedback, isAnonymous ,sectionId) }
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ---- View Comments ---- */}
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={fetchComments} variant="outline" className="flex-1">
              <MessageSquare className="w-4 mr-1" />
              View ({_count.feedback})
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Feedback & Comments</DialogTitle>
              <DialogDescription>For: {topic}</DialogDescription>
            </DialogHeader>

            <div className="max-h-[300px] overflow-y-auto space-y-2 scrollbar-hide">
              {commentsLoading ? (
                <>
                  <CommentSkeleton />
                  <CommentSkeleton />
                </>
              ) : comments.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No comments yet.
                </p>
              ) : (
                comments.map((c: any, i: number) => {
                  const avatar = c.anonymous ? getRandomAvatar() : c.user?.image;
                  const name = c.anonymous ? "Anonymous" : c.user?.username ?? "Unknown";

                  return (
                    <div
                      key={i}
                      className="p-3 border rounded-lg bg-muted/30 text-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={avatar} className="rounded-full object-cover" />
                          <AvatarFallback>AN</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{name}</span>
                      </div>
                      <p className="pl-8">{c.comment}</p>
                    </div>
                  );
                })
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}