export default function handler(req, res) {
    if (req.method === 'POST') {
      
        res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.set("Cache-Control", "post-check=0, pre-check=0");
        res.set("Pragma", "no-cache");
        res.status(200).send('');

    } else {

        res.status(200).send('');
        
    }
  }
  
