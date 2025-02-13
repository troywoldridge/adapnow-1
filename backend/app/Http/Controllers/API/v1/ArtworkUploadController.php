<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ArtworkUploadController extends Controller
{
    public function uploadArtwork(Request $request)
    {
        // Validate the request inputs
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer',
            'file' => 'required|file',
            'file_type' => 'required|string|in:pdf,jpeg,png,excel',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Retrieve the file from the request
        $file = $request->file('file');
        $productId = $request->input('product_id');
        $fileType = $request->input('file_type');

        // Validate file type based on the provided type
        $allowedMimeTypes = [
            'pdf' => ['application/pdf'],
            'jpeg' => ['image/jpeg'],
            'png' => ['image/png'],
            'excel' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
        ];

        if (!in_array($file->getMimeType(), $allowedMimeTypes[$fileType])) {
            return response()->json(['error' => 'Invalid file type'], 400);
        }

        // Generate a unique file name and determine storage path
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        $path = "artwork_uploads/{$productId}/";

        // Store the file in the S3 bucket or locally
        if (env('FILESYSTEM_DRIVER') === 's3') {
            $filePath = $file->storeAs($path, $filename, 's3');
        } else {
            $filePath = $file->storeAs($path, $filename, 'public');
        }

        // Store file metadata in the database (example model)
        $upload = new ArtworkUpload();
        $upload->product_id = $productId;
        $upload->file_path = $filePath;
        $upload->file_type = $fileType;
        $upload->save();

        return response()->json(['message' => 'File uploaded successfully', 'file_path' => $filePath], 200);
    }
}
