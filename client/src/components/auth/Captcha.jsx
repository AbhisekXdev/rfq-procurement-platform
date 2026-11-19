
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

  const onVerifiedRef = useRef(onVerified);
  const onErrorRef = useRef(onError);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  // Keep callbacks updated without recreating the Turnstile widget.
  useEffect(() => {
    onVerifiedRef.current = onVerified;
    onErrorRef.current = onError;
  }, [onVerified, onError]);

  useImperativeHandle(ref, () => ({
    execute() {
      if (!siteKey) {
        onErrorRef.current?.(
          "CAPTCHA is not configured. Add your Cloudflare Turnstile site key."
        );
        return;
      }

      if (!window.turnstile || widgetIdRef.current === null) {
        pendingExecuteRef.current = true;
        return;
      }

      try {
        window.turnstile.execute(widgetIdRef.current);
      } catch {
        pendingExecuteRef.current = false;
        onErrorRef.current?.(
          "Security verification could not start. Please try again."
        );
      }
    },

    reset() {
      pendingExecuteRef.current = false;

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }), [siteKey]);

  useEffect(() => {
    if (!siteKey) return undefined;

    let cancelled = false;
    let script = document.querySelector(
      `script[src="${SCRIPT_URL}"]`
    );

    const renderWidget = () => {
      if (
        cancelled ||
        !containerRef.current ||
        !window.turnstile ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      try {
        widgetIdRef.current = window.turnstile.render(
          containerRef.current,
          {
            sitekey: siteKey,

            // Execute verification only when requested.
            execution: "execute",
            appearance: "execute",

            // Do not use size: "invisible".
            // Invisible-style execution is controlled by appearance.

            callback: (token) => {
              onVerifiedRef.current?.(token);
            },

            "expired-callback": () => {
              onErrorRef.current?.(
                "CAPTCHA expired. Please try again."
              );
            },

            "error-callback": () => {
              onErrorRef.current?.(
                "CAPTCHA verification failed. Please try again."
              );
            },
          }
        );

        if (pendingExecuteRef.current) {
          pendingExecuteRef.current = false;
          window.turnstile.execute(widgetIdRef.current);
        }
      } catch {
        onErrorRef.current?.(
          "Unable to initialize security verification."
        );
      }
    };

    const handleScriptError = () => {
      if (!cancelled) {
        onErrorRef.current?.(
          "Unable to load security verification."
        );
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_URL;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", renderWidget);
      script.addEventListener("error", handleScriptError);
    }

    return () => {
      cancelled = true;

      if (script) {
        script.removeEventListener("load", renderWidget);
        script.removeEventListener("error", handleScriptError);
      }

      if (
        window.turnstile &&
        widgetIdRef.current !== null
      ) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
      pendingExecuteRef.current = false;
    };
  }, [siteKey]);

  return <div ref={containerRef} aria-hidden="true" />;
});

export default Captcha;
