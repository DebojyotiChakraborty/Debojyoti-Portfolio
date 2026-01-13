// Sound manager using actual audio files

class SoundManager {
    private audioContext: AudioContext | null = null;
    private rustleBuffer: AudioBuffer | null = null;
    private smashBuffer: AudioBuffer | null = null;
    private isInitialized = false;
    private isLoading = false;
    private lastRustleTime = 0;
    private rustleThrottleMs = 80;

    private async getAudioContext(): Promise<AudioContext | null> {
        if (typeof window === "undefined") return null;

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }

        // Always try to resume on each access (handles browser autoplay policy)
        if (this.audioContext.state === "suspended") {
            try {
                await this.audioContext.resume();
            } catch (e) {
                console.warn("Failed to resume audio context:", e);
            }
        }

        return this.audioContext;
    }

    private async loadAudioFile(url: string): Promise<AudioBuffer | null> {
        const ctx = await this.getAudioContext();
        if (!ctx) return null;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            return audioBuffer;
        } catch (error) {
            console.warn(`Failed to load audio: ${url}`, error);
            return null;
        }
    }

    async initialize(): Promise<void> {
        if (this.isInitialized || this.isLoading) return;
        this.isLoading = true;

        const ctx = await this.getAudioContext();
        if (!ctx) {
            this.isLoading = false;
            return;
        }

        // Load audio files if not already loaded
        if (!this.rustleBuffer || !this.smashBuffer) {
            const [rustleBuffer, smashBuffer] = await Promise.all([
                this.loadAudioFile("/sounds/grass-rustle.mp3"),
                this.loadAudioFile("/sounds/grass-smash.mp3"),
            ]);

            this.rustleBuffer = rustleBuffer;
            this.smashBuffer = smashBuffer;
        }

        this.isInitialized = true;
        this.isLoading = false;
    }

    // Play grass rustling sound
    async playRustle(intensity: number = 0.5): Promise<void> {
        const now = Date.now();
        if (now - this.lastRustleTime < this.rustleThrottleMs) return;
        this.lastRustleTime = now;

        const ctx = await this.getAudioContext();
        if (!ctx || !this.rustleBuffer) return;

        // Clamp intensity
        intensity = Math.max(0, Math.min(1, intensity));
        if (intensity < 0.1) return;

        try {
            // Create source
            const source = ctx.createBufferSource();
            source.buffer = this.rustleBuffer;

            // Randomize playback rate slightly for variety
            source.playbackRate.value = 0.9 + Math.random() * 0.2;

            // Gain based on intensity
            const gain = ctx.createGain();
            gain.gain.value = intensity * 0.4;

            // Connect and play
            source.connect(gain);
            gain.connect(ctx.destination);
            source.start();
        } catch (e) {
            console.warn("Failed to play rustle:", e);
        }
    }

    // Play grass smash/indent sound
    async playIndent(): Promise<void> {
        const ctx = await this.getAudioContext();
        if (!ctx || !this.smashBuffer) return;

        try {
            // Create source
            const source = ctx.createBufferSource();
            source.buffer = this.smashBuffer;

            // Slight pitch variation
            source.playbackRate.value = 0.95 + Math.random() * 0.1;

            // Gain
            const gain = ctx.createGain();
            gain.gain.value = 0.6;

            // Connect and play
            source.connect(gain);
            gain.connect(ctx.destination);
            source.start();
        } catch (e) {
            console.warn("Failed to play indent:", e);
        }
    }

    dispose(): void {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
            this.rustleBuffer = null;
            this.smashBuffer = null;
            this.isInitialized = false;
        }
    }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
    if (!soundManagerInstance) {
        soundManagerInstance = new SoundManager();
    }
    return soundManagerInstance;
}

export type { SoundManager };
