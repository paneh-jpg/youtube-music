import { LoadingSpinner } from "./LoadingSpinner";

export function LoadingCard() {
  return `
    <div class="relative block max-w-sm p-6 bg-neutral-primary-soft
                border border-default rounded-base shadow-xs">

      <h5 class="mb-2 text-xl font-semibold tracking-tight
                 text-heading opacity-20">
        Noteworthy technology acquisitions 2021
      </h5>

      <p class="font-normal text-body opacity-20">
        Here are the biggest enterprise technology acquisitions of 2021 so far.
      </p>

      <div class="absolute inset-0 flex items-center justify-center">
        ${LoadingSpinner({ size: 8 })}
      </div>
    </div>
  `;
}
