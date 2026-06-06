import { NextResponse } from "next/server";
import type { FeedbackPayload, FeedbackSubmission } from "@/types/feedback";

const submissions: FeedbackSubmission[] = [];

function validate(body: unknown): body is FeedbackPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  const isRating = (v: unknown) =>
    typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 10;

  const isNonEmptyStringArray = (v: unknown) =>
    Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === "string");

  return (
    isRating(b.overallSatisfaction) &&
    isRating(b.recommendationScore) &&
    isNonEmptyStringArray(b.featuresUsed) &&
    isNonEmptyStringArray(b.userRole) &&
    isNonEmptyStringArray(b.prioritizedImprovements)
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!validate(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const submission: FeedbackSubmission = {
    ...body,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  submissions.push(submission);

  return NextResponse.json({ id: submission.id }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(submissions);
}
