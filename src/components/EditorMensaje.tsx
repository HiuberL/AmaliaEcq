// src/components/EditorMensaje.tsx
'use client';

import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; 

interface EditorMensajeProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function EditorMensaje({ value, onChange, placeholder }: EditorMensajeProps) {
  const modulosEditor = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
      ['link', 'image'],                                
      ['clean']                                         
    ],
  };

  const formatosSoportados = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'link', 'image'
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modulosEditor}
      formats={formatosSoportados}
      placeholder={placeholder}
    />
  );
}