<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Jobs\FetchSinaliteProductsJob;
use App\Jobs\RefreshSinaliteToken;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\ClearLogs::class,
        Commands\UpdateMissingProductImageMappings::class,
        \App\Console\Commands\MatchProductImages::class,
        \App\Console\Commands\PopulateSinalitePricing::class,
        \App\Console\Commands\PrintProductIdsAndNames::class,
         Commands\CleanProductImages::class,
         Commands\CleanProductImagesAndS3::class,
         Commands\ListS3Keys::class,
         Commands\GenerateAltTextFromS3Keys::class,
    ];

    /**
     * Register any application commands.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');
        require base_path('routes/console.php');
    }

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Sync Sinalite Products daily at 2 AM
        $schedule->job(new FetchSinaliteProductsJob)->dailyAt('02:00')->withoutOverlapping();
        $schedule->job(new RefreshSinaliteToken())->everyThirtyMinutes();

        // Clear logs daily
        $schedule->command('clear:logs')->daily();
    
     $schedule->command('emails:send-campaign')->daily();
     $schedule->command('cart:send-emails')->hourly();    
    }


// app/Console/Kernel.php


}
