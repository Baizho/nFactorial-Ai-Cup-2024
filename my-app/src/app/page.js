"use client";

import Image from "next/image";
import '../../node_modules/katex/dist/katex.min.css';
import Latex from "react-latex-next";
import "./globals.css"
import { useState, useEffect } from "react";
import OpenAI from "openai";

import generatePDF from '../components/pdfGenerator';

const openai = new OpenAI({
  apiKey: "sk-proj-zbz8EvoRHLV8a1wbToGtT3BlbkFJEYKZfjoDmYYqiE2t12gh", dangerouslyAllowBrowser: true
})

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
    const typeOfPerson = "You are a bot that will generate competitive programming problem statements with a bit of story in them. "
      + "Do not talk like you are having a conversation. ";
    const prompt = "You are given an idea of a competitive programming problem. The idea is: " + idea + ". "
      + "You have to write a problem statement with a bit of story in it in LaTex. Please return your response in JSON format. Replace all `≤` with `<=`\n"
      + "["
      + "`title` : `Create a title for the problem`,"
      + "`legend` : `Create a legend (story) for the problem.`,"
      + "`input` : `Input for the problem.`,"
      + "`output` : `Output for the problem`,"
      + "`example` : {`input` : `text of numbers for the problem.`, `output` : `text the answer for the input.`},"
      + "`explanation` : `Explanation of the example for the problem`"
      + "].";
    const completion = await openai.chat.completions.create(
      {
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": typeOfPerson },
          { "role": "user", "content": prompt }
        ],
        response_format: { "type": "json_object" }
      }
    )
    const res = JSON.parse(completion.choices[0].message.content);

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
              <div className="col-9" style={{ position: "absolute" }} > Explanation of the example</div>
              <div className="col-3" style={{ position: "absolute", left: "90%" }}><button onClick={(e) => { copyText(e, explanation) }} className="copy-button">Copy</button></div>
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
