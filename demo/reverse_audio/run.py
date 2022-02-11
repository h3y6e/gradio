import numpy as np

import gradio as gr


def reverse_audio(audio):
    sr, data = audio
    return (sr, np.flipud(data))


iface = gr.Interface(reverse_audio, "microphone", "audio", examples="audio")

if __name__ == "__main__":
    iface.launch()
