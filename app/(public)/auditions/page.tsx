import AuditionForm from "@/components/AuditionForm";

export const metadata = {
  title: "Audition — Upstage A Cappella",
};

export default function AuditionsPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
          Interested in joining us?
        </h1>
        <p className="text-gray-600 leading-relaxed mb-16">
          We host auditions at the beginning of each semester. Leave your email
          below and we&apos;ll send you all of the details when the time comes!
        </p>

        <h2 className="font-display text-2xl font-bold text-navy mb-6">
          What to expect
        </h2>
        <div className="space-y-4 text-gray-600 leading-relaxed mb-16">
          <p>
            The audition process is nothing to stress about! Just prepare a 30 second
            to 1 minute snippet of a song you&apos;d like to perform for us (doesn't have to be Upstage related!). 
            We&apos;ll also run a few pitch matching exercises and some warmups.
          </p>
          <p>
            Callbacks happen less than a week after the initial audition. Stay
            tuned with ACK (A Cappella Council) for more information on
            callbacks and the overall process.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-surface p-6 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-navy mb-2">
            Get audition details
          </h2>
          <br/>
          <AuditionForm />
        </div>
      </div>
    </div>
  );
}
