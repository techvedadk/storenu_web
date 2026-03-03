"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { Turnstile } from "@marsidev/react-turnstile"
import { ui, defaultLang } from "@/i18n/ui"

interface StartStoreDialogProps {
    children: React.ReactNode;
    lang?: string;
}

type SubmissionStatus = "idle" | "loading" | "success" | "error";

export function StartStoreDialog({ children, lang = defaultLang }: StartStoreDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState<SubmissionStatus>("idle");
    const [token, setToken] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const activeLang = (lang in ui ? lang : defaultLang) as keyof typeof ui;
    const t = (key: string) => {
        // @ts-ignore
        return ui[activeLang][key] || ui[defaultLang][key] || key;
    };

    React.useEffect(() => {
        if (!open) {
            if (status === "success" || status === "error") {
                setTimeout(() => setStatus("idle"), 500);
            }
        }
    }, [open, status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            return;
        }

        setStatus("loading");

        try {
            const response = await fetch("https://storenu-hello.techveda.workers.dev/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    "cf-turnstile-response": token,
                    lang: activeLang
                }),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", phone: "", message: "" });
                setToken(null);
                setTimeout(() => setOpen(false), 2000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setStatus("error");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <>
            <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
                {children}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t('dialog.title')}</DialogTitle>
                        <DialogDescription>
                            {status === "success"
                                ? t('dialog.success.desc')
                                : t('dialog.desc')}
                        </DialogDescription>
                    </DialogHeader>

                    {status === "success" ? (
                        <div className="py-8 text-center flex flex-col items-center gap-4">
                            <div className="h-16 w-16 bg-main rounded-full flex items-center justify-center border-2 border-border shadow-shadow">
                                <svg xmlns="https://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <p className="font-heading text-xl">{t('dialog.success.title')}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('dialog.name')}</Label>
                                <Input
                                    id="name"
                                    placeholder={t('dialog.name.placeholder')}
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('dialog.email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t('dialog.email.placeholder')}
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">{t('dialog.phone')}</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder={t('dialog.phone.placeholder')}
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message">{t('dialog.message')}</Label>
                                <Textarea
                                    id="message"
                                    placeholder={t('dialog.message.placeholder')}
                                    required
                                    value={formData.message}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mt-2 flex justify-center">
                                <Turnstile
                                    siteKey="0x4AAAAAACgo7-ko1YUizm8d"
                                    onSuccess={(token) => setToken(token)}
                                    onExpire={() => setToken(null)}
                                    onError={() => setToken(null)}
                                />
                            </div>

                            {status === "error" && (
                                <p className="text-destructive font-medium text-sm text-center">
                                    {t('dialog.error')}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="mt-4"
                                disabled={!token || status === "loading"}
                            >
                                {status === "loading" ? t('dialog.loading') : t('dialog.send')}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
