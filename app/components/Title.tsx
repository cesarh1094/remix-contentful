export default function Title({ title, emoji }: { title: string; emoji: string }) {
  return (
    <h1 className="text-3xl leading-normal sm:text-5xl sm:leading-normal font-body dark:text-gray-200 mb-4 md:mb-12">
      <span className="rounded border-b-4 border-primary dark:border-secondary">{title}</span>&nbsp;
      <span role="img" aria-label={title}>
        {emoji}
      </span>
    </h1>
  );
}
