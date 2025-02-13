<?php


namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class CleanProductImagesAndS3 extends Command
{
    protected $signature = 'clean:s3-product-images';
    protected $description = 'Cleans up the product_images table and renames the corresponding S3 objects';

    protected $s3Client;
    protected $bucket;

    public function __construct()
    {
        parent::__construct();

        // Initialize AWS S3 client
        if (env('FILESYSTEM_DISK') === 's3') {
    $s3 = new \Aws\S3\S3Client([
        'version' => 'latest',
        'region'  => env('AWS_DEFAULT_REGION'),
        'credentials' => [
            'key'    => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
        ],
    ]);
} else {
    $s3 = null; // Skip initialization if not using S3.
}

    }

    public function handle()
    {
        // Fetch all records from the product_images table
        $images = DB::table('product_images')->get();

        // Add logging to indicate the start of processing
        $this->info("Starting product images cleanup... Processing " . count($images) . " records.");

        foreach ($images as $image) {
            // Original values
            $originalKey = $image->s3_key;
            $originalUrl = $image->image_url;

            // Create cleaned versions
            $cleanedKey = $this->cleanFileName($originalKey);
            $cleanedUrl = $this->cleanFileName($originalUrl);

            // Log every record being processed
            $this->info("Processing record ID {$image->id}:");
            $this->info("  Original Key: {$originalKey}");
            $this->info("  Cleaned Key: {$cleanedKey}");

            // If the cleaned name differs from the original, proceed with the renaming
            if ($cleanedKey !== $originalKey) {
                try {
                    // Log the renaming attempt
                    $this->info("  Attempting to rename S3 object from '{$originalKey}' to '{$cleanedKey}'...");

                    // Copy the object to a new key (cleaned key)
                    $this->s3Client->copyObject([
                        'Bucket'     => $this->bucket,
                        'CopySource' => "{$this->bucket}/{$originalKey}",
                        'Key'        => $cleanedKey,
                    ]);

                    // Delete the old object
                    $this->s3Client->deleteObject([
                        'Bucket' => $this->bucket,
                        'Key'    => $originalKey,
                    ]);

                    // Update the database with the new key and URL
                    DB::table('product_images')
                        ->where('id', $image->id)
                        ->update([
                            's3_key' => $cleanedKey,
                            'image_url' => str_replace($originalKey, $cleanedKey, $originalUrl),
                            'updated_at' => now(),
                        ]);

                    $this->info("  Updated record ID {$image->id} successfully.");
                } catch (AwsException $e) {
                    $this->error("Error processing record ID {$image->id}: " . $e->getMessage());
                }
            } else {
                // Log if no changes were needed
                $this->info("  No changes needed for record ID {$image->id}.");
            }
        }

        $this->info('Product images cleanup completed.');
    }


    private function cleanFileName($fileName)
    {
        // Replace spaces with hyphens
        $cleanedName = str_replace(' ', '-', $fileName);

        // Replace other special characters
        $cleanedName = preg_replace('/[^A-Za-z0-9\-.]/', '-', $cleanedName);

        // Convert to lowercase
        $cleanedName = strtolower($cleanedName);

        return $cleanedName;
    }
}

