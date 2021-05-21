

class Printer{
    print(contentId, frameId){
        const content = document.getElementById(contentId);
        const pri = document.getElementById(frameId).contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }
}

export const printer = new Printer();