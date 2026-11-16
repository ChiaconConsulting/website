import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Renders admin-authored Markdown. Raw HTML is not rendered, so content cannot inject scripts. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-c", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
