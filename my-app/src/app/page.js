"use client";

import Image from "next/image";
import '../../node_modules/katex/dist/katex.min.css';
import Latex from "react-latex-next";
import "./globals.css"
import { useState, useEffect } from "react";
import { generateText } from "./actions";

import generatePDF from '../components/pdfGenerator';


export default function Chat() {
  const [title, updTitle] = useState('');
  const [legend, updLegend] = useState('');
  const [input, updInput] = useState('');
  const [output, updOutput] = useState('');
  const [example, updExample] = useState('');
  const [explanation, updExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');



  const handleGeneratePdf = async () => {
    const pdfBytes = await generatePDF(
      {
        title: JSON.stringify(title),
        legend: JSON.stringify(legend),
        input: JSON.stringify(input),
        output: JSON.stringify(output),
        example: JSON.stringify(example),
        explanation: JSON.stringify(explanation)
      }
    );
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPdfUrl('');
    let idea = e.target.elements.idea.value;
    const res = await generateText(idea);
    updTitle(res.title);
    updLegend(res.legend);
    updInput(res.input);
    updOutput(res.output);
    updExample("Input: " + res.example.input.replaceAll(/\s+/g, ' ') + " Output: " + res.example.output.replaceAll(/\s+/g, ' '));
    updExplanation(res.explanation);
  };

  const copyText = (e, name) => {
    navigator.clipboard.writeText(name);
  };



  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading === true) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      <form className="d-flex align-items-center justify-content-center" style={{ height: 100 }} onSubmit={(event) => { return handleSubmit(event); }}>
        <input className="inputIdea" type="text" id="idea" name="idea" placeholder="Enter your competitive programming idea" />
      </form>
      <div className="row" style={{ marginBottom: 10 }}>
        <div className="d-flex align-items-center justify-content-center" style={{ color: "white" }}>
          <h1>Generate Problem Statement in PDF</h1>
        </div>
        {title && (<div className="d-flex align-items-center justify-content-center" style={{ color: "white" }}>
          <button className="generate-pdf-button" onClick={handleGeneratePdf}>Generate PDF</button>
        </div>)}
        {pdfUrl && (<div className="d-flex align-items-center justify-content-center" style={{ color: "white" }}>
          <div>PDF generated. Click <a href={pdfUrl} target="_blank" rel="noopener noreferrer">here</a> to open it in a new tab.</div>
        </div>)}
      </div>

      <div className="container">
        <div className="row" style={{ height: 200 }}>
          <div className="col-6 outer-col">
            <div className="row inner-col-input" style={{ position: "relative" }}>
              <div className="col-6" style={{ position: "absolute" }} > Title</div>
              <div className="col-6" style={{ position: "absolute", left: "90%" }}><button onClick={(e) => { copyText(e, title) }} className="copy-button">Copy</button></div>
            </div>
            <div className="row inner-col-text">
              <Latex>
                {title}
              </Latex>
            </div>
          </div>
          <div className="col-6 outer-col">
            <div className="row inner-col-input" style={{ position: "relative" }}>
              <div className="col-6" style={{ position: "absolute" }} > Legend (Statement) </div>
              <div className="col-6" style={{ position: "absolute", left: "90%" }}><button onClick={(e) => { copyText(e, legend) }} className="copy-button">Copy</button></div>
            </div>
            <div className="row inner-col-text">
              <Latex>
                {legend}
              </Latex>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: "min(10px, 1%)", height: 200 }}>
          <div className="col-6 outer-col">
            <div className="row inner-col-input" style={{ position: "relative" }}>
              <div className="col-6" style={{ position: "absolute" }} > Input</div>
              <div className="col-6" style={{ position: "absolute", left: "90%" }}><button onClick={(e) => { copyText(e, input) }} className="copy-button">Copy</button></div>
            </div>
            <div className="row inner-col-text">
              <Latex>
                {input}
              </Latex>
            </div>
          </div>
          <div className="col-6 outer-col">
            <div className="row inner-col-input" style={{ position: "relative" }}>
              <div className="col-6" style={{ position: "absolute" }} > Output</div>
              <div className="col-6" style={{ position: "absolute", left: "90%" }}><button onClick={(e) => { copyText(e, output) }} className="copy-button">Copy</button></div>
            </div>
            <div className="row inner-col-text">
              <Latex>
                {output}
              </Latex>
            </div>
          </div>

        </div>
        <div className="row" style={{ marginTop: "min(10px, 1%)", height: 200 }}>

          <div className="col-6 outer-col">
            <div className="row inner-col-input" style={{ position: "relative" }}>
              <div className="col-6" style={{ position: "absolute" }} > Example</div>
              <div className="col-6" style={{ position: "absolute", left: "90%" }}><button onClick={(e) => { copyText(e, example) }} className="copy-button">Copy</button></div>
            </div>
            <div className="row inner-col-text">
              <Latex>
                {example}
              </Latex>
            </div>
          </div>
          <div className="col-6 outer-col">
            <div className="row inner-col-input" style={{ position: "relative" }}>
              <div className="col-6" style={{ position: "absolute" }} > Explanation of the example</div>
              <div className="col-6" style={{ position: "absolute", left: "90%" }}><button onClick={(e) => { copyText(e, explanation) }} className="copy-button">Copy</button></div>
            </div>
            <div className="row inner-col-text">
              <Latex>
                {explanation}
              </Latex>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
