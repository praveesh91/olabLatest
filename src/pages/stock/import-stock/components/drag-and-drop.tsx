import React, { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { upload } from "@testing-library/user-event/dist/upload";
import { getExtensionName } from "../../../../services/common.services";

function DragAndDrop({
  onUpload,
  onError,
  multiple = false,
  allowType = ".csv",
}: {
  onUpload?: (files: FileList) => void;
  multiple?: boolean;
  allowType?: string;
  onError?: any;
}) {
  const onDrop = (acceptedFiles: any): any => {
    if (onError) {
      if (acceptedFiles.length === 0) {
        onError({
          type: "Accept only " + getExtensionName(allowType),
        });
      }
    }

    if (onUpload) {
      onUpload(acceptedFiles);
    }
  };

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    accept: allowType,
    maxFiles: 1,
  });

  return (
    <div className="mt-4">
      <div {...getRootProps()} className="drag-and-drop-box w-100">
        <input {...getInputProps()} />
        <img
          src="/images/upload.svg"
          alt="upload"
          className="drag-and-drop-box-img"
        />
        <p style={{ fontWeight: "bold" }}>Drag and Drop Your File Here</p>
        <p style={{ fontWeight: "bold" }}>OR</p>
        <Button className="px-5">Browse Files</Button>
        <div className="short-notes text-center">
          <p>Only CSV can be uploaded</p>
          <p>Stock levels will change after successful import of file</p>
        </div>
      </div>
    </div>
  );
}

export default DragAndDrop;
