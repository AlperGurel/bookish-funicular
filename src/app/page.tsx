"use client";

import Image from "next/image";
import { useState } from "react";

const endpoint = "https://helloworld-udo4zt7ixa-uc.a.run.app/";

interface ApiResponse {
  message?: string;
  group?: number;
  rate_limit_left?: number;
  stream_seq?: 0;
  error?: boolean;
}

export default function Home() {
  const [variableToken, setVariableToken] = useState("USER999");

  const [res1, setRes1] = useState("");
  const [res2, setRes2] = useState<ApiResponse | null>(null);
  const [res3, setRes3] = useState<ApiResponse | null>(null);
  const [res4, setRes4] = useState<ApiResponse[]>([]);
  const [res5, setRes5] = useState<ApiResponse[]>([]);

  const [res1Waiting, setRes1Waiting] = useState(false);
  const [res2Waiting, setRes2Waiting] = useState(false);
  const [res3Waiting, setRes3Waiting] = useState(false);
  const [res4Waiting, setRes4Waiting] = useState(false);
  const [res5Waiting, setRes5Waiting] = useState(false);

  const onReq1 = async () => {
    setRes1("");
    setRes1Waiting(true);
    const res = await fetch(endpoint);
    if (res.status == 200) {
      const data = await res.json();
      console.log(data);
    } else if (res.status == 401) {
      setRes1("Unauthorized.");
    }
    setRes1Waiting(false);
  };

  const onReq2 = async () => {
    setRes2(null);
    setRes2Waiting(true);
    const res = await fetch(endpoint, {
      headers: {
        authorization: "Bearer USER123",
      },
    });
    if (res.status == 200) {
      const data = await res.json();
      setRes2(data);
      console.log(data);
    } else if (res.status == 401) {
      setRes2({ message: "Unauthorized." });
    }
    setRes2Waiting(false);
  };

  const onReq3 = async () => {
    setRes3(null);
    setRes3Waiting(true);
    const res = await fetch(endpoint, {
      headers: {
        authorization: `Bearer ${variableToken}`,
      },
    });
    if (res.status == 200) {
      const data = await res.json();
      setRes3(data);
      console.log(data);
    } else if (res.status == 401) {
      setRes3({ message: "Unauthorized." });
    }
    setRes3Waiting(false);
  };

  const onReq4 = async () => {
    setRes4([]);
    setRes4Waiting(true);

    while (true) {
      const res = await fetch(endpoint, {
        headers: {
          authorization: `Bearer USER555`,
        },
      });
      if (res.status == 200) {
        const data = await res.json();
        setRes4((prevRes) => [...prevRes, data]);
      } else if (res.status == 429) {
        setRes4((prevRes) => [
          ...prevRes,
          {
            message: "Rate Limit Exceeded!",
            error: true,
          },
        ]);
        console.log(res4);
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <div>
          <h2 className="text-2xl font-bold">API Endpoint</h2>
          <p className="mt-4">
            API için Google Cloud Functions kullandım. Bu tercihimin nedeni daha
            önceden Express.js ve Firestore tecrübem olması.
          </p>
          <a
            href="https://helloworld-udo4zt7ixa-uc.a.run.app/"
            className="text-blue-600 font-bold"
            target="_blank"
          >
            Bu link
          </a>
          'i kullanarak API Endpoint'ine ulaşabilirsiniz.
          <a
            href="https://github.com/AlperGurel/bookish-funicular"
            className="text-blue-600 font-bold block mt-2"
            target="_blank"
          >
            Frontend Source
          </a>
          <a
            href="https://github.com/AlperGurel/didactic-invention"
            className="text-blue-600 font-bold block mt-2"
            target="_blank"
          >
            API Source
          </a>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold mt-12">Authorization</h3>
          <div className="mt-4">
            <p>
              Herhangi bir parametre vermeden bu endpoint'e istek atıldığı zaman{" "}
              <i>stream</i> parametresi default olarak <i>false</i> değerini
              alır.
            </p>
            <p>
              Aşağıdaki istek gönder butonuna tıklayarak yada curl komutu ile
              server'a istek gönderebilirsiniz.
            </p>
            <code className="bg-stone-800 text-white/70 p-4 rounded-lg inline-block mt-2">
              curl "https://helloworld-udo4zt7ixa-uc.a.run.app/"
            </code>
            <button
              className="block bg-green-400 p-2 rounded-lg mt-2"
              onClick={onReq1}
            >
              İstek Gönder
            </button>
            <div className="bg-stone-300 p-4  mt-2 rounded-lg text-slate-700">
              <span className="font-bold text-xs">Response</span>
              <div className="mt-3">
                {res1Waiting && "Yanıt bekleniyor..."}
                {res1}
              </div>
            </div>
            <p className="mt-4">
              Herhangi bir authentication header'ı göndermediğimiz için
              "Unauthorized." hatası aldık.
            </p>
            <p className="mt-4">
              Aşağıdaki curl komutu ile gereken header'ları ekleyip tekrar
              deneyebiliriz.
            </p>
            <code className="bg-stone-800 text-white/70 p-4 rounded-lg inline-block mt-2">
              curl "https://helloworld-udo4zt7ixa-uc.a.run.app/" -H
              "Authorization: Bearer USER123"
            </code>
            <button
              className="block bg-green-400 p-2 rounded-lg mt-2"
              onClick={onReq2}
            >
              İstek Gönder
            </button>
            <div className="bg-stone-300 p-4  mt-2 rounded-lg text-slate-700">
              <span className="font-bold text-xs">Response</span>
              <div className="mt-3">
                {res2Waiting && "Yanıt bekleniyor..."}
                {res2 && res2.message}
              </div>
            </div>
            <p className="mt-8">
              Eğer farklı tokenlar ile test etmek istersek aşağıdaki inputtaki
              tokenı değiştirmemiz yeterli.
            </p>
            <input
              className="p-2 mt-2 border-2 rounded-md"
              type="text"
              value={variableToken}
              onChange={(e) => {
                setVariableToken(e.target.value);
              }}
            />{" "}
            <span>Token</span>
            <code className="bg-stone-800 text-white/70 p-4 rounded-lg block mt-2">
              curl "https://helloworld-udo4zt7ixa-uc.a.run.app/" -H
              "Authorization: Bearer {variableToken?.toUpperCase()}"
            </code>
            <button
              className="block bg-green-400 p-2 rounded-lg mt-2"
              onClick={onReq3}
            >
              İstek Gönder
            </button>
            <div className="bg-stone-300 p-4  mt-2 rounded-lg text-slate-700">
              <span className="font-bold text-xs">Response</span>
              <div className="mt-3">
                {res3Waiting && "Yanıt bekleniyor..."}
                {res3 && res3.message}
              </div>
            </div>
            <p className="mt-4">
              <span className="font-bold text-lg"># </span>
              User'lar için ziyaret sayısı FireStore'a kaydediliyor.
            </p>
            <p className="mt-4">
              <span className="font-bold text-lg"># </span>
              "USER_ASDF" gibi standart dışı bir token kullanıldığı zaman yine
              "Unauthorized" hatası alıyoruz.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold mt-12">Rate Limiting</h3>
          <p className="mt-2">Mevcut limit: 4 request/dakika</p>
          <p>
            Kullanıcılar bu limiti aştıklarında "429 - Rate Limit Exceeded"
            hatası alıyorlar.
          </p>
          <p className="font-bold">
            Aşağıdaki butona bir kez tıklayarak senaryonun çıktısını
            görebilirsiniz.
          </p>
          <code className="bg-stone-800 text-white/70 p-4 rounded-lg inline-block mt-2">
            curl "https://helloworld-udo4zt7ixa-uc.a.run.app/" -H
            "Authorization: Bearer USER555"
          </code>
          <button
            className="block bg-green-400 p-2 rounded-lg mt-2 disabled:bg-slate-300"
            onClick={onReq4}
            disabled={res4Waiting}
          >
            Rate Limit Senaryosunu Başlat
          </button>
          <div className="bg-stone-300 p-4  mt-2 rounded-lg text-slate-700">
            <span className="font-bold text-xs">Response</span>
            <div className="mt-3">
              {res4Waiting && "Yanıt bekleniyor..."}
              {res4.map((el, index) => (
                <div key={index}>
                  {el.error && <p className="text-red-500">{el?.message}</p>}
                  {!el.error && <p className="">{el?.message}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold mt-12">Streaming</h3>
          <code className="bg-stone-800 text-white/70 p-4 rounded-lg inline-block mt-2">
            curl "https://helloworld-udo4zt7ixa-uc.a.run.app?stream=true" -H
            "Authorization: Bearer USER389" --no-buffer
          </code>
          <p>
            <i>stream</i> parametresini <i>true</i> yaptığımız durumda
            server'dan 5 parça halinde response gelecektir.
          </p>
          <p>Yukarıdaki curl komutu ile bunu görebilirsiniz.</p>
        </div>
      </div>
    </main>
  );
}
