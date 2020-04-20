"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// interval is in seconds (can be decimal)
class Timer {
    constructor(intervalInMS, func, maxCallCount = -1) {
        this.timerID = -1;
        this.callCount_thisRun = 0;
        this.callCount_total = 0;
        //Assert(IsNumber(intervalInMS), "Interval must be a number.");
        this.intervalInMS = intervalInMS;
        this.func = func;
        this.maxCallCount = maxCallCount;
        /*if (TimerContext.default_autoAddAll) {
            TimerContext.default.timers.push(this);
        }*/
    }
    get IsRunning() { return this.timerID != -1; }
    get NextTickFuncOverdue() {
        return this.nextTickTime != null && Date.now() > this.nextTickTime && this.nextTickFunc != null;
    }
    Start(initialDelayOverride = null) {
        // if start is called when it's already running, stop the timer first (thus we restart the timer instead of causing overlapping setIntervals/delayed-func-calls)
        if (this.IsRunning)
            this.Stop();
        this.startTime = Date.now();
        const StartRegularInterval = () => {
            this.nextTickTime = this.startTime + this.intervalInMS;
            this.timerID = setInterval(this.nextTickFunc = () => {
                this.callCount_thisRun++;
                this.callCount_total++;
                this.func();
                if (this.maxCallCount != -1 && this.callCount_thisRun >= this.maxCallCount) {
                    this.Stop();
                }
                else {
                    //this.nextTickTime += this.intervalInMS;
                    this.nextTickTime = Date.now() + this.intervalInMS; // using Date.now() prevents the prop from getting out-of-sync (from sleep-mode)
                }
            }, this.intervalInMS); // "as any": maybe temp; used to allow source-importing from NodeJS
        };
        if (initialDelayOverride != null) {
            this.nextTickTime = this.startTime + initialDelayOverride;
            this.timerID = setTimeout(this.nextTickFunc = () => {
                this.callCount_thisRun++;
                this.callCount_total++;
                this.func();
                if (this.maxCallCount != -1 && this.callCount_thisRun >= this.maxCallCount) {
                    this.Stop();
                }
                else {
                    StartRegularInterval();
                }
            }, initialDelayOverride); // "as any": maybe temp; used to allow source-importing from NodeJS
        }
        else {
            StartRegularInterval();
        }
        return this; // enable chaining, for SetContext() call
    }
    Stop() {
        clearInterval(this.timerID);
        //this.startTime = null;
        this.nextTickTime = null;
        this.nextTickFunc = null;
        this.timerID = -1;
        this.callCount_thisRun = 0;
    }
}
exports.Timer = Timer;
/**
Downloads the given content to disk. Call must be triggered by an input event, or run from the console.
Very large strings may fail to download directly, but can be resolved by placing in a Blob:
StartDownload(new Blob(["someVeryLongString"]), "Backup.txt");
*/
function StartDownload(content, filename, dataTypeStr = "data:application/octet-stream,", encodeContentAsURIComp = true) {
    var link = document.createElement("a");
    Object.assign(link.style, { display: "none" });
    link.innerText = "Save to disk";
    if (content instanceof Blob) {
        // todo: make sure this works correctly, even for different data-types (since data-type args are ignored if Blob supplied)
        link.setAttribute("href", URL.createObjectURL(content));
    }
    else {
        link.setAttribute("href", dataTypeStr + (encodeContentAsURIComp ? encodeURIComponent(content) : content));
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
}
exports.StartDownload = StartDownload;
// CE_Number
// ==========
function ToPercentStr(s, /** The number of digits after the decimal point. Example: (.12345).ToPercentStr(1) == "12.3%" */ precision) {
    let number = s * 100;
    if (precision != null)
        return number.toFixed(precision) + "%";
    return number.toString() + "%";
}
exports.ToPercentStr = ToPercentStr;
function RoundTo(s, multiple) {
    //return Math.round(this / multiple) * multiple;
    // Don't ask me why this works, but it does, and is faster. From: http://phrogz.net/round-to-nearest-via-modulus-division
    /*var half = multiple / 2;
    return (this + half) - ((this + half) % multiple);*/
    // Realign/scale the possible values/multiples, so that each value is given an integer slot. Place the actual value (this) within the appropriate slot using Math.round() int-rounding, then reverse the scaling to get the true rounded value.
    // (This version handles fractions better. Ex: (.2 + .1).RoundTo(.1) == .3 [NOT 0.3000000000000004, as the simpler approach gives])
    let multiple_inverted = 1 / multiple;
    return Math.round(s * multiple_inverted) / multiple_inverted;
}
exports.RoundTo = RoundTo;
function RoundTo_Str(s, multipleOf, fractionDigits, removeEmptyFraction = true) {
    var resultValue = RoundTo(s, multipleOf);
    var result = resultValue.toFixed(fractionDigits != null ? fractionDigits : TrimStart(multipleOf.toString(), "0").length - 1); // - 0);
    if (removeEmptyFraction && result.includes(".")) {
        result = TrimEnd(TrimEnd(result, "0"), ".");
    }
    return result;
}
exports.RoundTo_Str = RoundTo_Str;
// CE_String
// ==========
function TrimStart(s, ...chars) {
    for (var iOfFirstToKeep = 0; iOfFirstToKeep < s.length && chars.includes(s[iOfFirstToKeep]); iOfFirstToKeep++)
        ;
    return s.slice(iOfFirstToKeep, s.length);
}
exports.TrimStart = TrimStart;
function TrimEnd(s, ...chars) {
    for (var iOfLastToKeep = s.length - 1; iOfLastToKeep >= 0 && chars.includes(s[iOfLastToKeep]); iOfLastToKeep--)
        ;
    return s.substr(0, iOfLastToKeep + 1);
}
exports.TrimEnd = TrimEnd;
