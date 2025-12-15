"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Key, Wand2, Clipboard, Check, LockKeyhole } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";

export default function EncryptionTool() {
  const [inputText, setInputText] = useState("");
  const [shift, setShift] = useState(3);
  const [operation, setOperation] = useState<"encrypt" | "decrypt">("encrypt");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();


  const processText = () => {
    let result = "";
    const shiftValue = operation === "encrypt" ? shift : -shift;

    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      let code = inputText.charCodeAt(i);

      if (char.match(/[a-z]/)) {
        code = ((code - 97 + shiftValue) % 26 + 26) % 26 + 97;
      } else if (char.match(/[A-Z]/)) {
        code = ((code - 65 + shiftValue) % 26 + 26) % 26 + 65;
      }
      // Non-alphabetic characters are not changed.

      result += String.fromCharCode(code);
    }
    setOutputText(result);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-headline tracking-tight flex items-center gap-3">
          <LockKeyhole className="h-8 w-8 text-primary" />
          Simple Encryption Tool
        </CardTitle>
        <CardDescription className="font-body">
          Enter text to encrypt or decrypt using the Caesar cipher method.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="input-text">Input Text</Label>
          <Textarea
            id="input-text"
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-32 text-base resize-y"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card className="bg-background/50 shadow-inner">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Operation</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <RadioGroup
                value={operation}
                onValueChange={(value: "encrypt" | "decrypt") => setOperation(value)}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="encrypt" id="r1" />
                  <Label htmlFor="r1" className="flex items-center gap-2 cursor-pointer text-sm">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Encrypt
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="decrypt" id="r2" />
                  <Label htmlFor="r2" className="flex items-center gap-2 cursor-pointer text-sm">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Decrypt
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="bg-background/50 shadow-inner">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Shift Value</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Input
                id="shift-value"
                type="number"
                value={shift}
                onChange={(e) => setShift(parseInt(e.target.value, 10) || 0)}
                className="w-full"
                aria-label="Shift value"
              />
              <p className="text-xs text-muted-foreground mt-2">The number of positions to shift letters.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-2">
          <Button onClick={processText} size="lg" className="w-full sm:w-auto transform transition-transform duration-150 hover:scale-105 active:scale-100 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-5 w-5" />
            Process Text
          </Button>
        </div>
        
        {outputText && (
          <>
            <Separator />
            <div className="space-y-2 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <Label htmlFor="output-text">Output</Label>
                <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </div>
              <Textarea
                id="output-text"
                readOnly
                value={outputText}
                className="min-h-32 text-base resize-y bg-muted/30"
              />
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
}
