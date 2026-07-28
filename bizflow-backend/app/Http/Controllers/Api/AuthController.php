<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Base\BaseController;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseController
{
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->error(
                'Invalid credentials',
                401
            );
        }

        $token = $user->createToken('bizflow-token')->plainTextToken;

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'Login successful');
    }

    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return $this->success(
            null,
            'Logout successful'
    );
    }
    public function user()
    {
        return $this->success(
            auth()->user(),
            'Authenticated user retrieved successfully'
        );
    }
}