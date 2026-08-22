import { motion, type Variants } from "framer-motion";
import {
  Shield,
  Activity,
  Eye,
  Zap,
  AlertTriangle,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

const features = [
  {
    icon: Shield,
    title: "Threat Detection",
    description:
      "Real-time monitoring and automated threat identification across your entire security perimeter.",
  },
  {
    icon: Eye,
    title: "SOC Dashboard",
    description:
      "Centralized security operations view with live alerts, incident tracking, and team collaboration.",
  },
  {
    icon: Zap,
    title: "Automated Response",
    description:
      "Instant playbook execution for containment, isolation, and remediation of active threats.",
  },
  {
    icon: Activity,
    title: "Log Intelligence",
    description:
      "Multi-source log ingestion with AI-powered analysis and anomaly detection across all telemetry.",
  },
  {
    icon: AlertTriangle,
    title: "Vulnerability Scanning",
    description:
      "Continuous asset discovery and vulnerability assessment with CVSS scoring and priority ranking.",
  },
  {
    icon: Lock,
    title: "Compliance & Reporting",
    description:
      "Automated compliance checks and executive-ready reporting for audits and stakeholder updates.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="size-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              HydraWatch
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer gap-1.5"
              >
                Dashboard
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="cursor-pointer"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  className="cursor-pointer gap-1.5"
                >
                  Get Started
                  <ChevronRight className="size-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              Security Operations Platform
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Defend your perimeter
            <br />
            <span className="text-muted-foreground">
              with real-time intelligence
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            HydraWatch SOC provides unified threat detection, automated
            response, and comprehensive visibility across your entire security
            stack — from endpoint to cloud.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer gap-1.5"
              >
                Open Dashboard
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="cursor-pointer gap-1.5"
                >
                  Start Free
                  <ChevronRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="cursor-pointer"
                >
                  Sign in to Workspace
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Built for modern security teams
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to detect, investigate, and respond to threats
              — all in one place.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="group rounded-xl border border-border/60 bg-background p-6 transition-colors hover:border-primary/20"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm leading-5 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to secure your infrastructure?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Set up your security operations center in minutes, not months.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer gap-1.5"
                >
                  Go to Dashboard
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="cursor-pointer gap-1.5"
                  >
                    Get Started
                    <ChevronRight className="size-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/auth")}
                    className="cursor-pointer"
                  >
                    Sign in
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="size-3.5" />
            <span>HydraWatch SOC</span>
          </div>
          <span>
            &copy; {new Date().getFullYear()} HydraWatch. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
