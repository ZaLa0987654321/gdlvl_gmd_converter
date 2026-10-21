const parser = new DOMParser();
const prw = document.getElementById('preview');
const lvl_name = document.getElementById('lvl-name');
const downloadBtn = document.getElementById('downloadBtn');
var current_lvl_name = "unknown";

document.getElementById('file-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    text = await file.text();
    binary_data = Uint8Array.fromBase64(text, { alphabet: 'base64url' });
    const cs = new DecompressionStream("gzip");
    const writer = cs.writable.getWriter();
    writer.write(binary_data);
    writer.close();
    xml_content = await new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
      return new TextDecoder().decode(arrayBuffer);
    })
    console.log(xml_content);

    //lvl name
    const xmlDoc = parser.parseFromString(xml_content, "text/xml");
    current_lvl_name = xmlDoc.querySelector("s").textContent;
    lvl_name.textContent = "Level: " + current_lvl_name;
    
    prw.textContent = xml_content.slice(0, 500);
    if (xml_content.length > 50) {
      prw.textContent += "...";
    }

    downloadBtn.disabled = false;
  }
});

downloadBtn.addEventListener('click', function() {
  const blob = new Blob([xml_content], { type: 'application/octet-stream;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = current_lvl_name + '.gmd'; 
  link.click();
  URL.revokeObjectURL(url);
});



// ------------------


const prw2 = document.getElementById('preview2');
const lvl_name2 = document.getElementById('lvl-name2');
const downloadBtn2 = document.getElementById('downloadBtn2');
var current_lvl_name2 = "unknown";

document.getElementById('file-input2').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    text = await file.text();

    const encoder = new TextEncoder();
    const byteArray = encoder.encode(text);

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(byteArray);
        controller.close();
      }
    });

    const compressionStream = stream.pipeThrough(new CompressionStream('gzip'));
    const gzipped_bytes = await new Response(compressionStream).arrayBuffer();

    gdlvl_output = new Uint8Array(gzipped_bytes).toBase64({ alphabet: 'base64url' });

    console.log(gdlvl_output);

    //lvl name
    const xmlDoc = parser.parseFromString(text, "text/xml");
    current_lvl_name2 = xmlDoc.querySelector("s").textContent;
    lvl_name2.textContent = "Level: " + current_lvl_name2;
    
    prw2.textContent = gdlvl_output.slice(0, 500);
    if (gdlvl_output.length > 50) {
      prw2.textContent += "...";
    }

    downloadBtn2.disabled = false;
  }
});

downloadBtn2.addEventListener('click', function() {
  const blob = new Blob([gdlvl_output], { type: 'application/octet-stream;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = current_lvl_name2 + '.gdlvl'; 
  link.click();
  URL.revokeObjectURL(url);
});