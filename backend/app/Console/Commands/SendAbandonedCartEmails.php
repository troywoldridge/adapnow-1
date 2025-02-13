// app/Console/Commands/SendAbandonedCartEmails.php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CartSession;
use Illuminate\Support\Facades\Mail;

class SendAbandonedCartEmails extends Command
{
    protected $signature = 'cart:send-emails';
    protected $description = 'Send emails for abandoned carts';

    public function handle()
    {
        $carts = CartSession::where('updated_at', '<', now()->subHours(24))
            ->whereNotNull('user_id')
            ->get();

        foreach ($carts as $cart) {
            $user = $cart->user;
            $cartItems = json_decode($cart->cart_data, true);

            Mail::to($user->email)->send(new \App\Mail\AbandonedCartEmail($user, $cartItems));
        }

        $this->info('Abandoned cart emails sent successfully.');
    }
}
