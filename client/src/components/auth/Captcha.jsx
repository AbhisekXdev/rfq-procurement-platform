
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const Captcha = forwardRef(function Captcha(
  { onVerified, onError },
  ref
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const pendingExecuteRef = useRef(false);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useImperativeHandle(ref, () => ({
    execute() {
      if (!siteKey) {
        onError?.(
          "CAPTCHA is not configured. Add your Cloudflare Turnstile site key."
        );
        return;
      }

      if (!window.turnstile || widgetIdRef.current === null) {
        pendingExecuteRef.current = true;
        return;
      }

      window.turnstile.execute(widgetIdRef.current);
    },

    reset() {
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    if (!siteKey) return undefined;

    let cancelled = false;

    const renderWidget = () => {
      if (
        cancelled ||
        !containerRef.current ||
        !window.turnstile ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(
        containerRef.current,
        {
          sitekey: siteKey,
          size: "invisible",
          execution: "execute",

          callback: (token) => {
            pendingExecuteRef.current = false;
            onVerified?.(token);
          },

          "expired-callback": () => {
            onError?.("Security verification expired. Please try again.");
          },

          "error-callback": () => {
            pendingExecuteRef.current = false;
            onError?.("Security verification failed. Please try again.");
          },
        }
      );

      if (pendingExecuteRef.current) {
        pendingExecuteRef.current = false;
        window.turnstile.execute(widgetIdRef.current);
      }
    };

    let script = document.querySelector(
      `script[src="${SCRIPT_URL}"]`
    );

    if (window.turnstile) {
      renderWidget();
    } else if (script) {
      script.addEventListener("load", renderWidget);
    } else {
      script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderWidget);
      script.addEventListener("error", () => {
        onError?.("Unable to load security verification.");
      });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;

      if (script) {
        script.removeEventListener("load", renderWidget);
      }

      if (
        window.turnstile &&
        widgetIdRef.current !== null
      ) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
    };
  }, [siteKey, onVerified, onError]);

  return <div ref={containerRef} aria-hidden="true" />;
});

export default Captcha;
