<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Gamification;
use App\Models\User;

class GamificationController extends Controller
{
    /**
     * Add points to a user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addPoints(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        // Add points to the user's gamification record
        $gamification = Gamification::create([
            'user_id' => $request->user_id,
            'points' => $request->points,
            'description' => $request->description ?? 'Points added by admin',
        ]);

        return response()->json([
            'message' => 'Points added successfully.',
            'data' => $gamification,
        ]);
    }

    /**
     * Get the rewards and total points for a user.
     *
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRewards($userId)
    {
        $user = User::with('gamifications')->find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $totalPoints = $user->gamifications->sum('points');

        // Example reward logic
        $rewards = [
            ['name' => 'Discount Coupon', 'points_required' => 500],
            ['name' => 'Free Shipping', 'points_required' => 1000],
            ['name' => 'Premium Membership', 'points_required' => 5000],
        ];

        return response()->json([
            'total_points' => $totalPoints,
            'rewards' => $rewards,
        ]);
    }
}
