import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  ariaValueText?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ariaValueText, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center h-[44px] cursor-pointer",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-white/[0.14]">
      <SliderPrimitive.Range className="absolute h-full bg-[#C9A96E] rounded-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      aria-label={props["aria-label"]}
      aria-valuetext={ariaValueText || (props.value ? `${props.value[0]}` : undefined)}
      className="block w-5 h-5 rounded-full bg-[#C9A96E] border-[3px] border-[#0B1220] transition-shadow duration-150 hover:shadow-[0_0_12px_rgba(201,169,110,0.5)] active:shadow-[0_0_16px_rgba(201,169,110,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] cursor-grab active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
