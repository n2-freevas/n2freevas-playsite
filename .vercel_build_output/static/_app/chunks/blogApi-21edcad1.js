import{Q as i}from"./vendor-f1a3cc63.js";i.defaults.headers.post["Access-Control-Allow-Origin"]="*";const h=i.create({headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}}),a=(r,t,e,s)=>h({method:r,url:"https://n2-cors-anywhere.herokuapp.com/"+t,data:e,headers:s}).then(o=>Promise.resolve(o.data)).catch(o=>Promise.reject(o)),g=async(r,t,e)=>await a("get",r,t,e),d=async(r,t,e)=>await a("post",r,t,e),m=async(r,t,e)=>(await a("put",r,t,e)).data,c={get:g,post:d,put:m},_="secret_noefNNFVWANKd58NxfkoNV717LhK5D1ueYuQImgWFK0",l="https://api.notion.com/v1/",f=l+"databases/",y=l+"blocks/",p={Authorization:"Bearer "+_,"Notion-Version":"2021-07-27"};function w(r){let t=[];return r.results.forEach(e=>{let s=[];e.properties.Tags.multi_select.forEach(n=>{let u={tag_name:n.name,tag_color:n.color};s.push(u)});let o={page_id:e.id,page_title:e.properties.Contents.title[0].plain_text.replace(`
`,"<br>"),tags:s,thumbnail:e.properties.Thumbnail.url};t.push(o)}),t}const b=async r=>{try{return await c.get(y+r+"/children?page_size=100",void 0,p)}catch(t){throw t}},N=async(r,t)=>{let e;t?e=t:e={filter:{property:"Open_flg",checkbox:{equals:!0}},sorts:[{timestamp:"last_edited_time",direction:"ascending"}]};try{let s=await c.post(f+r+"/query",e,p);return w(s)}catch(s){throw s}};export{b as a,N as g};
