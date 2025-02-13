// app/Mail/AbandonedCartEmail.php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AbandonedCartEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $cartItems;

    public function __construct($user, $cartItems)
    {
        $this->user = $user;
        $this->cartItems = $cartItems;
    }

    public function build()
    {
        return $this->subject('You left something in your cart!')
            ->view('emails.abandoned-cart')
            ->with([
                'user' => $this->user,
                'cartItems' => $this->cartItems,
            ]);
    }
}
