import { ResultClient } from "./ResultClient";

export default function ExamResultPage({
  params
}: {
  params: { sessionId: string };
}) {
  return <ResultClient sessionId={params.sessionId} />;
}
