// interval is in seconds (can be decimal)
export class Timer {
	constructor(intervalInMS, func, maxCallCount = -1) {
		//Assert(IsNumber(intervalInMS), "Interval must be a number.");
		this.intervalInMS = intervalInMS;
		this.func = func;
		this.maxCallCount = maxCallCount;
		/*if (TimerContext.default_autoAddAll) {
			TimerContext.default.timers.push(this);
		}*/
	}

	intervalInMS: number;
	func: Function;
	maxCallCount: number;

	startTime: number;
	timerID = -1;
	get IsRunning() { return this.timerID != -1; }

	nextTickTime: number|null;
	nextTickFunc: Function|null; // used by the TimerContext.ManuallyTriggerOverdueTimers() function
	get NextTickFuncOverdue() {
		return this.nextTickTime != null && Date.now() > this.nextTickTime && this.nextTickFunc != null;
	}
	
	callCount_thisRun = 0;
	callCount_total = 0;
	Start(initialDelayOverride: number|null = null) {
		// if start is called when it's already running, stop the timer first (thus we restart the timer instead of causing overlapping setIntervals/delayed-func-calls)
		if (this.IsRunning) this.Stop();
		this.startTime = Date.now();

		const StartRegularInterval = ()=> {
			this.nextTickTime = this.startTime + this.intervalInMS;
			this.timerID = setInterval(this.nextTickFunc = ()=> {
				this.callCount_thisRun++;
				this.callCount_total++;
				this.func();
				if (this.maxCallCount != -1 && this.callCount_thisRun >= this.maxCallCount) {
					this.Stop();
				} else {
					//this.nextTickTime += this.intervalInMS;
					this.nextTickTime = Date.now() + this.intervalInMS; // using Date.now() prevents the prop from getting out-of-sync (from sleep-mode)
				}
			}, this.intervalInMS) as any; // "as any": maybe temp; used to allow source-importing from NodeJS
		};

		if (initialDelayOverride != null) {
			this.nextTickTime = this.startTime + initialDelayOverride;
			this.timerID = setTimeout(this.nextTickFunc = ()=> {
				this.callCount_thisRun++;
				this.callCount_total++;
				this.func();
				if (this.maxCallCount != -1 && this.callCount_thisRun >= this.maxCallCount) {
					this.Stop();
				} else {
					StartRegularInterval();
				}
			}, initialDelayOverride) as any; // "as any": maybe temp; used to allow source-importing from NodeJS
		} else {
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