namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wishlist;

class WishlistController extends Controller
{
   public function addPoints(Request $request)
   {
       $request->validate([
       'points' => 'required|integer|min:1',
        ]);

       $user = auth()->user();
       $user->rewards->increment('points', $request->input('points'));

       return response()->json(['message' => 'Points added', 'points' => $user->rewards->points]);
   }
   public function getRewards()
   {
       $rewards = auth()->user()->rewards;
       return response()->json($rewards);
   }
}


