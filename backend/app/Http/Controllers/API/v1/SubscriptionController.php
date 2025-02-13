<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Mail;
use App\Models\EmailSubscription;
use App\Http\Controllers\Controller;


class SubscriptionController extends Controller
{
public function subscribe(Request $request)
{
    // Validate the incoming request
    $request->validate([
        'email' => 'required|email|unique:email_subscriptions,email',
    ]);

    try {
        // Create a new subscription
        $subscription = new EmailSubscription();
        $subscription->email = $request->input('email');
        $subscription->is_verified = false; // Set to false initially
        $subscription->save();

        return response()->json(['message' => 'Subscription successful. Please check your email for verification.'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to subscribe.'], 500);
    }
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscribers,email',
            'user_id' => 'nullable|integer',
        ]);

        $subscriber = Subscriber::create([
            'email' => $validated['email'],
            'user_id' => $validated['user_id'] ?? null,
            'is_verified' => 0,
        ]);

        // Send verification email here
        $verificationLink = route('subscriptions.verify', ['id' => $subscriber->id]);

        Mail::to($subscriber->email)->send(new \App\Mail\SubscriptionVerification($verificationLink));

        return response()->json(['message' => 'Please check your email to verify your subscription.'], 201);
    }

    public function verify($id)
    {
        $subscriber = Subscriber::find($id);

        if (!$subscriber) {
            return response()->json(['message' => 'Subscriber not found.'], 404);
        }

        $subscriber->is_verified = 1;
        $subscriber->save();

        return response()->json(['message' => 'Subscription verified successfully.']);
    }

    public function unsubscribe($id)
    {
        $subscriber = Subscriber::find($id);

        if (!$subscriber) {
            return response()->json(['message' => 'Subscriber not found.'], 404);
        }

        $subscriber->unsubscribed_at = now();
        $subscriber->save();

        return response()->json(['message' => 'You have unsubscribed successfully.']);
    }

    public function sendEmails(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        $subscribers = Subscriber::where('is_verified', 1)
                                  ->whereNull('unsubscribed_at')
                                  ->get();

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(new \App\Mail\CampaignEmail($validated['subject'], $validated['message']));
        }

        return response()->json(['message' => 'Emails sent successfully.']);
    }
}
