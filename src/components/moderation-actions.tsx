"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { CheckIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { moderate } from "@/server/actions";

type Verification = "SELF_DECLARED" | "EVIDENCE_PROVIDED" | "ADMIN_VERIFIED";

const VERIFICATION_OPTIONS: { value: Verification; label: string }[] = [
  { value: "SELF_DECLARED", label: "Self-declared" },
  { value: "EVIDENCE_PROVIDED", label: "Evidence provided" },
  { value: "ADMIN_VERIFIED", label: "Admin verified" },
];

interface ModerationActionsProps {
  businessId: string;
}

export function ModerationActions({ businessId }: ModerationActionsProps) {
  const [isPending, startTransition] = useTransition();

  // Approve state
  const [verification, setVerification] = useState<Verification>("SELF_DECLARED");

  // Reject dialog state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [rejectError, setRejectError] = useState("");

  function handleApprove() {
    startTransition(async () => {
      const result = await moderate(businessId, "approve", { verification });
      if (result.ok) {
        toast.success("Business approved and published.");
      } else {
        toast.error(result.error ?? "Failed to approve.");
      }
    });
  }

  function handleRejectSubmit() {
    if (!rejectNote.trim()) {
      setRejectError("Please provide a reason for rejection.");
      return;
    }
    setRejectError("");
    setRejectOpen(false);
    startTransition(async () => {
      const result = await moderate(businessId, "reject", {
        note: rejectNote.trim(),
      });
      if (result.ok) {
        toast.success("Business rejected.");
        setRejectNote("");
      } else {
        toast.error(result.error ?? "Failed to reject.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Approve section: verification select + approve button */}
      <div className="flex items-center gap-2">
        <Label htmlFor={`verify-${businessId}`} className="sr-only">
          Verification level
        </Label>
        <Select
          value={verification}
          onValueChange={(v) => setVerification(v as Verification)}
          disabled={isPending}
        >
          <SelectTrigger
            id={`verify-${businessId}`}
            className="h-11 min-w-[160px] text-sm"
            aria-label="Set verification level"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VERIFICATION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleApprove}
          disabled={isPending}
          aria-disabled={isPending}
          className="h-11 gap-2 px-4 text-sm font-semibold"
        >
          <CheckIcon className="size-4" aria-hidden="true" />
          {isPending ? "Saving…" : "Approve"}
        </Button>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-border" aria-hidden="true" />

      {/* Reject button — opens dialog */}
      <Button
        variant="destructive"
        onClick={() => setRejectOpen(true)}
        disabled={isPending}
        aria-disabled={isPending}
        className="h-11 gap-2 px-4 text-sm font-semibold"
      >
        <XIcon className="size-4" aria-hidden="true" />
        Reject
      </Button>

      {/* Reject reason dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject submission</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <Label htmlFor={`reject-note-${businessId}`}>
              Reason for rejection{" "}
              <span aria-hidden="true" className="text-destructive">
                *
              </span>
            </Label>
            <Textarea
              id={`reject-note-${businessId}`}
              value={rejectNote}
              onChange={(e) => {
                setRejectNote(e.target.value);
                if (rejectError) setRejectError("");
              }}
              placeholder="Explain why this submission is being rejected…"
              rows={3}
              aria-required="true"
              aria-describedby={
                rejectError ? `reject-error-${businessId}` : undefined
              }
              aria-invalid={!!rejectError}
            />
            {rejectError && (
              <p
                id={`reject-error-${businessId}`}
                role="alert"
                className="text-xs text-destructive"
              >
                {rejectError}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  type="button"
                  className="h-11"
                  onClick={() => {
                    setRejectNote("");
                    setRejectError("");
                  }}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              type="button"
              onClick={handleRejectSubmit}
              className="h-11 gap-2"
            >
              <XIcon className="size-4" aria-hidden="true" />
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
