import {
  type FileWithPath,
  type DropzoneRootProps,
  type DropzoneInputProps,
} from "react-dropzone";

function DropZoneInput({
  acceptedFiles,
  getRootProps,
  getInputProps,
}: {
  acceptedFiles: File[];
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
}) {
  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {(file.size / 1000).toFixed(1)} KB
    </li>
  ));

  return (
    <section className="container">
      <div
        {...getRootProps({
          className:
            "flex-1 h-24 justify-center flex flex-col items-center p-5 border-2 rounded-md border-dashed transition duration-150 ease-in-out border-[hsl(214.29_30.061%_31.961%)]/20 text-gray-400 focus:border-blue-400  focus:text-blue-400 cursor-pointer outline-none",
        })}
      >
        <input {...getInputProps()} />
        <p>Drag n drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default DropZoneInput;