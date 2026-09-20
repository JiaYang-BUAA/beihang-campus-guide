import * as THREE from 'three';

const palette={'教学科研':0x8ca3b8,'公共文化':0x389d9d,'生活服务':0xb39b7a,'体育':0x6898ad,'住宅':0xb39b7a,'其他':0x9ba7ad};
export const partsOf=b=>b.parts?.length?b.parts:[b];
export function footprintCenter(b){
 if(b.labelPoint)return b.labelPoint;
 const p=partsOf(b).flatMap(part=>part.poly||b.poly),xs=p.map(v=>v[0]),ys=p.map(v=>v[1]);
 return [(Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2];
}
export function isUncertain(b){return /planned|unverified|construction/.test(b.status||'');}

export function createCampusModel(campus,texture,world){
 const group=new THREE.Group(),meshes=[],[, ,w,h]=campus.crop,width=w/h*1000;
 const base=new THREE.Mesh(new THREE.BoxGeometry(width+12,12,1012),new THREE.MeshStandardMaterial({color:0xd1dce2,roughness:.9}));base.position.y=-7;base.receiveShadow=true;group.add(base);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(width,1000),new THREE.MeshStandardMaterial({map:texture,roughness:1,color:0xffffff}));ground.rotation.x=-Math.PI/2;ground.position.y=.1;ground.receiveShadow=true;group.add(ground);
 let courtyards=0;
 const pathPoints=poly=>poly.map(([x,y])=>{const [wx,wz]=world(x,y);return new THREE.Vector2(wx,-wz);});
 for(const b of campus.buildings){
  const color=new THREE.Color(isUncertain(b)?0xb9895f:(palette[b.type]??0x9da9b5));
  const top=new THREE.MeshStandardMaterial({color:color.clone().lerp(new THREE.Color(0xffffff),.16),roughness:.8});
  const sides=new THREE.MeshStandardMaterial({color:color.clone().multiplyScalar(.78),roughness:.85});
  for(const part of partsOf(b)){
   const poly=part.poly||b.poly,height=part.height??b.height??20;
   if(!poly||poly.length<3||!Number.isFinite(height)||height<=0)throw Error('无效建筑轮廓: '+b.id);
   const shape=new THREE.Shape(pathPoints(poly));
   for(const hole of part.holes||[])shape.holes.push(new THREE.Path(pathPoints(hole)));
   courtyards+=(part.holes||[]).length;
   const geo=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false,curveSegments:1});geo.rotateX(-Math.PI/2);
   const mesh=new THREE.Mesh(geo,[top,sides]);mesh.position.y=.3+(part.baseHeight||0);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.b=b;group.add(mesh);meshes.push(mesh);
   const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0xf7fbff,transparent:true,opacity:.4}));edge.position.y=mesh.position.y+.02;group.add(edge);
  }
 }
 const roofs=new THREE.Group();group.add(roofs);
 for(const r of campus.roofs||[]){
  if(!r.bounds)continue;
  const [x,y,rw,rh]=r.bounds,nx=40,ny=96,vertices=[],indices=[];
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
   const u=i/nx,v=j/ny,[wx,wz]=world(x+rw*u,y+rh*v),t=r.axis==='x'?u:v;
   const z=(r.centerHeight??40)+((r.edgeHeight??65)-(r.centerHeight??40))*(2*t-1)**2;
   vertices.push(wx,z,wz);
  }
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
   const px=x+rw*(i+.5)/nx,py=y+rh*(j+.5)/ny,band=r.porousBand;
   // The central band is open between longitudinal strips, as seen in HENN's public photographs.
   if(band&&px>band[0]&&px<band[0]+band[2]&&py>band[1]&&py<band[1]+band[3]&&i%3!==0)continue;
   if((r.cutouts||[]).some(([cx,cy,cw,ch])=>px>cx&&px<cx+cw&&py>cy&&py<cy+ch))continue;
   const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(a,c,b,b,c,d);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();
  const roof=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xc8d1d8,roughness:.55,metalness:.25,side:THREE.DoubleSide}));roof.castShadow=true;roof.receiveShadow=true;roofs.add(roof);
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geo,20),new THREE.LineBasicMaterial({color:0xf8fbfc,transparent:true,opacity:.6}));roofs.add(edge);
 }
 return {group,meshes,ground,roofs,courtyards};
}
