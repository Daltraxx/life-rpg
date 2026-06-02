import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { UserProgress } from "@/utils/types/UserProgress";

export default function AttributeSummary({
  userProgress,
}: {
  userProgress: UserProgress;
}) {
  return (
    <section>
      <Heading as="h2" size="30-responsive" color="blue-700">
        Attributes
      </Heading>
      <ul></ul>
    </section>
  );
}
