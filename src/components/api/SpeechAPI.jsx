import * as Config from './Constants'
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk"
import { timeStamp } from '../util/Util'

export function SpeechToTextContinualStart(speechLang, setRecognizer, callback, errorHandler) {
    const subscriptionKey = Config.SPEECH_SUBSCRIPTION_KEY;
    const serviceRegion = Config.SPEECH_SERVICE_REGION;
    console.log(timeStamp() + `:--${serviceRegion}--`);

    let speechConfig;
    if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
        alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
        return;
    } else {
        speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        speechConfig.enableDictation(); //Kim: Activate dictation mode.
    }

    let autoDetectConfig = SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages(speechLang)
    let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    let recognizer = SpeechSDK.SpeechRecognizer.FromConfig(speechConfig, autoDetectConfig, audioConfig);

    //spec: startContinuousRecognitionAsync(cb?: () => void, err?: (e: string) => void): void;
    recognizer.startContinuousRecognitionAsync(
        function () {
            console.log(timeStamp() + ':--recording start--');
            setRecognizer(recognizer);
        },
        function (err) {
            console.log(err);
            errorHandler();
            alert(err);
        }
    );

    recognizer.recognizing = function (sender, event) {
        //let result = event.result;
    };

    recognizer.recognized = function (sender, event) {
        let result = event.result;
        const languageDetectionResult = SpeechSDK.AutoDetectSourceLanguageResult.fromResult(result);
        const detectedLanguage = languageDetectionResult.privLanguage;

        if (result.text) {
            callback(detectedLanguage, result.text);
        }
    };

    recognizer.canceled = (s, e) => {
        alert(e.reason);
        SpeechToTextContinualStopWithoutCallback(recognizer);
    }
}

export function SpeechToTextContinualStopWithoutCallback(recognizer) {
    if (recognizer) {
        recognizer.stopContinuousRecognitionAsync(
            function () {
                console.log(timeStamp() + ':--recording stop--');
            },
            function (err) {
                console.log(err);
            }
        );
    }
}

export function SpeechToTextContinualStop(recognizer, callback) {
    //spec: stopContinuousRecognitionAsync(cb?: () => void, err?: (e: string) => void): void;
    if (recognizer) {
        recognizer.stopContinuousRecognitionAsync(
            function () {
                console.log(timeStamp() + ':--recording stop--');
                callback();
            },
            function (err) {
                console.log(err);
            }
        );
    }
}

export function TextTranslator(from, to, text, callback) {
    let URL = Config.TRANSLATOR_TEXT_ENDPOINT + '/translate?api-version=3.0&from=' + from + '&to=' + to;
    let arrOfObj = [{ Text: text }];

    fetch(URL, {
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Config.TRANSLATOR_TEXT_SUBSCRIPTION_KEY,
            'Ocp-Apim-Subscription-Region': Config.TRANSLATOR_TEXT_REGION_AKA_LOCATION,
            'Content-type': 'application/json',
        },
        body: JSON.stringify(arrOfObj)
    })
        .then((response) => {
            if (!response.ok) throw new Error(response.status);
            else return response.json();
        })
        .then((data) => {
            //Kim: Optional Chaining for null check. var data = [{translations: [{text:"Saab"}, "Volvo"]}, "BMW"];
            if (data?.length) {
                if(data[0].translations?.length){
                    let rtn = data[0].translations[0];
                    const text = rtn?.text;
                    if(text)
                        callback(text);
                }
            }
        })
        .catch((error) => {
            console.log('error: ' + error);
            callback(error);
        });
}
