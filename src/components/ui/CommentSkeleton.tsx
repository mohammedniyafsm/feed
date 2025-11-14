export default function CommentSkeleton() {
  return (
    <div className="p-3 border rounded-lg bg-muted/30 animate-pulse flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="w-6 h-6 bg-muted rounded-full"></div>
        <div className="w-24 h-3 bg-muted rounded"></div>
      </div>
      <div className="ml-8 w-40 h-3 bg-muted rounded"></div>
    </div>
  );
}
