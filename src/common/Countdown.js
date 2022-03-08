import useCountdown from "hooks/useCountdown";

/**
 * @param {CountdownProps} props
 */
function Countdown(props) {
  const { children, date, ...rest } = props;
  const countdown = useCountdown(date, rest);
  return children?.(countdown);
}

export default Countdown;

/**
 * @typedef {{
 * children: (countdown: ReturnType<typeof useCountdown>) => import("react").ReactNode
 * } & import("hooks/useCountdown").CountdownOptions} CountdownProps
 */
