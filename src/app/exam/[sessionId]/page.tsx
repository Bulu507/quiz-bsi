import { ExamClient } from "./ExamClient";

export default function ExamPage({
  params
}: {
  params: { sessionId: string };
}) {
  return <ExamClient packageId={params.sessionId} />;
}
