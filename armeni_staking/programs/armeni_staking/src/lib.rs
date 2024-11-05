use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, Transfer, SetAuthority};
use spl_token::instruction::AuthorityType;

// Replace with actual program ID after deploying the contract
declare_id!("YourProgramIDHere");

#[program]
pub mod armeni_staking {
    use super::*;

    // Initialize the staking account with an authority and reward rate
    pub fn initialize(ctx: Context<Initialize>, reward_rate: u64) -> ProgramResult {
        let staking_account = &mut ctx.accounts.staking_account;
        staking_account.authority = *ctx.accounts.authority.key;
        staking_account.reward_rate = reward_rate;
        Ok(())
    }

    // Stake tokens by transferring them to the staking pool and updating user data
    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> ProgramResult {
        let staking_account = &mut ctx.accounts.staking_account;
        let user_account = &mut ctx.accounts.user_account;

        // Ensure staking amount is positive
        if amount == 0 {
            return Err(ProgramError::InvalidArgument);
        }

        // Transfer tokens from user to staking pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.staking_token_account.to_account_info(),
            authority: ctx.accounts.authority.clone(),
        };
        let cpi_context = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_context, amount)?;

        // Update user stake data
        user_account.staked_amount += amount;
        user_account.stake_time = Clock::get()?.unix_timestamp;
        Ok(())
    }

    // Claim rewards based on the staked amount and elapsed time
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> ProgramResult {
        let staking_account = &mut ctx.accounts.staking_account;
        let user_account = &mut ctx.accounts.user_account;

        // Calculate rewards based on the reward rate and elapsed time
        let current_time = Clock::get()?.unix_timestamp;
        let elapsed_time = current_time - user_account.stake_time;
        
        // Prevent zero or negative rewards
        if elapsed_time <= 0 {
            return Err(ProgramError::InvalidArgument);
        }

        let reward = user_account.staked_amount
            .checked_mul(staking_account.reward_rate)
            .and_then(|v| v.checked_mul(elapsed_time as u64))
            .ok_or(ProgramError::InvalidArgument)?;

        // Update last claim time
        user_account.last_claim_time = current_time;

        // Transfer rewards from staking pool to user
        let cpi_accounts = Transfer {
            from: ctx.accounts.staking_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.staking_pool_authority.clone(),
        };
        let cpi_context = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_context, reward)?;
        Ok(())
    }
}

// Define the account contexts for instructions
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 64)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub staking_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub staking_token_account: Account<'info, TokenAccount>,
    pub staking_pool_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

// Define data stored in each account
#[account]
pub struct StakingAccount {
    pub authority: Pubkey,
    pub reward_rate: u64,
}

#[account]
pub struct UserAccount {
    pub staked_amount: u64,
    pub stake_time: i64,
    pub last_claim_time: i64,
}

