import tkinter as tk
import cv2
from PIL import Image,ImageTk
import numpy as np
import datetime
import os


class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        
        global chap_flg,width,height
        width=640
        height=480
        chap_flg=0
         #キャンバスを作成
        self.canvas1 = tk.Canvas(root,  width=640, height=480, bg="white")
        self.canvas1.grid(row=1, column=1)

        self.canvas2 = tk.Canvas(root,  width=640, height=480, bg="white")
        self.canvas2.grid(row=1, column=2)

        self.start_btn = tk.Button(root, text='キャプチャ開始',width=70,command=capStart)
        self.start_btn.grid(row=2, column=1)
        
        self.end_btn = tk.Button(root, text='キャプチャ終了',width=70,command=capEnd)
        self.end_btn.grid(row=2, column=2)


def capStart():
    print('開始')
    global chap_flg,writer1,writer2
    now = datetime.datetime.now()
    
    fourcc = cv2.VideoWriter_fourcc('m','p','4','v')
    fps = c2.get(cv2.CAP_PROP_FPS)

    file_name1 = '{}.mp4'.format(now.strftime('%Y%m%d_%H%M%S'+'A'))
    file_name2 = '{}.mp4'.format(now.strftime('%Y%m%d_%H%M%S'+'B'))

    writer1 = cv2.VideoWriter(file_name1, fourcc, fps, (int(width), int(height)))
    writer2 = cv2.VideoWriter(file_name2, fourcc, fps, (width,height))
    chap_flg=1
    

def capEnd():
    global chap_flg,writer1,writer2
    chap_flg=0
    writer1.release()
    writer2.release()
    print('終了')

    

def Set_cam():
    print('camera-ON')
    try:
        global c1,c2
        device_id1=0
        c1 = cv2.VideoCapture(device_id1)
        c1.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        c1.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        c1.set(cv2.CAP_PROP_FPS, 30)

        device_id2=2
        c2 = cv2.VideoCapture(device_id2)
        c2.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        c2.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        c2.set(cv2.CAP_PROP_FPS, 30)
        
    except:
        root.quit()

def update_movie():
    global img1,img2

    ret1, frame1 =c1.read()
    ret2, frame2 =c2.read()

    if ret1 and ret2:
        img1=ImageTk.PhotoImage(Image.fromarray(cv2.cvtColor(frame1, cv2.COLOR_BGR2RGB)))
        app.canvas1.create_image(width/2,height/2,image=img1)

        img2=ImageTk.PhotoImage(Image.fromarray(cv2.cvtColor(frame2, cv2.COLOR_BGR2RGB)))
        app.canvas2.create_image(width/2,height/2,image=img2)
        if(chap_flg==1):
            writer1.write(frame1)
            writer2.write(frame2)
            print('撮影中')
        
        
    else:
        print("update_error")

    root.after(1,update_movie)
 

if __name__ == '__main__':
    root = tk.Tk()
    root.geometry("1280x510")
    root.resizable(width=False, height=False)
    root.title("Multi-View") 

    app = Application(master=root)
    Set_cam()
    update_movie()
    app.mainloop()