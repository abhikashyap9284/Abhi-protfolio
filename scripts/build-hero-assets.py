#!/usr/bin/env python3
"""Rebuild local hero media. Requires ffmpeg, ffprobe, numpy and Pillow.
The loop is middle [fade,T-fade] followed by tail/head crossfade. Audio uses
exactly the same order and sample count, avoiding retiming or acrossfade.
"""
import argparse,json,subprocess,tempfile,wave
from pathlib import Path
import numpy as np
from PIL import Image,ImageOps,ImageDraw

def run(args): subprocess.run(args,check=True)
def probe(path): return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
def detect_crop(source,w,h):
 frames=[]
 for t in [0.5,2,4,6,8]:
  raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(t),'-i',str(source),'-frames:v','1','-vf',f'scale={w}:{h}','-f','rawvideo','-pix_fmt','rgb24','-'])
  if len(raw)!=w*h*3:continue
  frame=np.frombuffer(raw,dtype=np.uint8).reshape(h,w,3)
  # Ignore the outer quarters, compression near white, and ground shadows.
  mask=(frame.min(axis=2)<195)&(np.arange(w)[None,:]>w*.25)&(np.arange(w)[None,:]<w*.75)
  ys,xs=np.where(mask)
  if len(xs):frames.append((xs.min(),ys.min(),xs.max(),ys.max()))
 if not frames:raise RuntimeError('No subject detected; pass --crop width:height:x:y.')
 x0=max(0,min(f[0] for f in frames)-50);x1=min(w,max(f[2] for f in frames)+50)
 y0=max(0,min(f[1] for f in frames)-24);y1=min(h,max(f[3] for f in frames)+24)
 ch=(y1-y0)//2*2;cw=max((x1-x0)//2*2,int(ch*.72)//2*2)
 cx=(x0+x1)//2;x=max(0,min(w-cw,cx-cw//2))//2*2
 return f'{cw}:{ch}:{x}:{y0//2*2}'

def main():
 p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('--out',type=Path,default=Path('public'));p.add_argument('--photo',type=Path);p.add_argument('--crop');p.add_argument('--fade',type=float,default=.5);p.add_argument('--seconds',type=float,default=10)
 a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True);hero=a.out/'hero';hero.mkdir(exist_ok=True)
 meta=probe(a.source);v=next(s for s in meta['streams'] if s['codec_type']=='video');has_audio=any(s['codec_type']=='audio' for s in meta['streams'])
 duration=min(float(meta['format']['duration']),a.seconds);fps=24;frames=int(duration*fps);duration=frames/fps;fade_frames=max(1,round(a.fade*fps));fade=fade_frames/fps
 if duration<=3*fade:raise ValueError('Clip is too short for the fade.')
 crop=a.crop or detect_crop(a.source,int(v['width']),int(v['height']));print('Crop:',crop,flush=True)
 with tempfile.TemporaryDirectory() as td:
  temp=Path(td);sound=temp/'loop.wav';clip=temp/'picture.mp4'
  if has_audio:
   raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(a.source),'-t',str(duration),'-vn','-f','f32le','-ac','2','-ar','48000','-'])
   audio=np.frombuffer(raw,dtype=np.float32).reshape(-1,2);n=round(duration*48000);audio=np.pad(audio,((0,max(0,n-len(audio))),(0,0)))[:n];f=round(fade*48000)
   weights=np.linspace(0,1,f,endpoint=False,dtype=np.float32)[:,None]
   overlap=audio[-f:]*(1-weights)+audio[:f]*weights
   loop=np.concatenate([audio[f:-f],overlap]);pcm=(np.clip(loop,-1,1)*32767).astype('<i2')
   with wave.open(str(sound),'wb') as wf:wf.setnchannels(2);wf.setsampwidth(2);wf.setframerate(48000);wf.writeframes(pcm.tobytes())
  # xfade is used only for picture; numpy owns audio overlap.
  filters=f'[0:v]fps={fps},trim=duration={duration},setpts=PTS-STARTPTS,crop={crop},scale=768:-2,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,format=yuv420p,split=3[m][t][h];[m]trim=start={fade}:end={duration-fade},setpts=PTS-STARTPTS[mid];[t]trim=start={duration-fade}:end={duration},setpts=PTS-STARTPTS[tail];[h]trim=end={fade},setpts=PTS-STARTPTS[head];[tail][head]xfade=transition=fade:duration={fade}:offset=0[blend];[mid][blend]concat=n=2:v=1:a=0,trim=duration={duration-fade}[out]'
  run(['ffmpeg','-y','-v','error','-filter_complex_threads','1','-i',str(a.source),'-filter_complex',filters,'-map','[out]','-an','-c:v','libx264','-crf','18','-preset','fast',str(clip)])
  for extension,codec,crf,a_codec,bitrate in [('mp4','libx264','24','aac','96k'),('webm','libvpx-vp9','36','libopus','80k')]:
   args=['ffmpeg','-y','-v','error','-i',str(clip)]
   if has_audio:args+=['-i',str(sound),'-map','0:v','-map','1:a']
   args+=['-c:v',codec,'-crf',crf,'-pix_fmt','yuv420p']
   if extension=='mp4':args+=['-preset','slow','-movflags','+faststart']
   else:args+=['-b:v','0','-deadline','good','-cpu-used','2','-row-mt','1']
   if has_audio:args+=['-c:a',a_codec,'-b:a',bitrate,'-shortest']
   args+=[str(hero/f'hero.{extension}')];run(args);print('Exported',extension,flush=True)
  run(['ffmpeg','-y','-v','error','-ss','1','-i',str(clip),'-frames:v','1',str(hero/'poster.webp')])
 if a.photo:
  photo=Image.open(a.photo).convert('RGB');photo=ImageOps.fit(photo,(480,600),method=Image.Resampling.LANCZOS);photo.save(a.out/'portrait-bust.webp',quality=88)
 else:
  photo=Image.open(hero/'poster.webp').convert('RGB');photo=ImageOps.fit(photo,(480,600),method=Image.Resampling.LANCZOS,centering=(.5,0));photo.save(a.out/'portrait-bust.webp',quality=88)
 # Social card uses only verified name and role.
 og=Image.new('RGB',(1200,630),'#f4f2ee');og.paste(ImageOps.fit(photo,(380,475)),(760,78));d=ImageDraw.Draw(og)
 from PIL import ImageFont
 font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
 d.text((70,160),'Abhishek Kashyap',font=ImageFont.truetype(font,47),fill='#0d0d0d');d.text((70,235),'Full Stack Developer',font=ImageFont.truetype(font,31),fill='#77756f');d.text((70,460),'abhikashyap9284@gmail.com',font=ImageFont.truetype(font,23),fill='#3a3a3a');og.save(a.out/'og.jpg',quality=90)
 print('Media complete.',flush=True)
if __name__=='__main__':main()
